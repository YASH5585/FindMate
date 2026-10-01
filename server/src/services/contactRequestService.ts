import { query as dbQuery } from '../db';
import { randomUUID } from 'crypto';
import type { ContactRequest, CreateContactRequest } from '../types/contactRequest';
import { CONTACT_REQUEST_STATUSES } from '../types/contactRequest';

export { CONTACT_REQUEST_STATUSES };

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['accepted', 'declined'],
  accepted: ['closed'],
  declined: ['closed'],
  closed: [],
};

function isValidTransition(from: string, to: string): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) === true;
}

const isParticipant = (request: { senderId: string; receiverId: string }, userId: string): boolean =>
  request.senderId === userId || request.receiverId === userId;

export async function createContactRequest(
  senderId: string,
  data: CreateContactRequest
): Promise<ContactRequest> {
  const itemRes = await dbQuery(
    `SELECT id, user_id, name AS "itemName" FROM items WHERE id = $1`,
    [data.itemId]
  );
  if (itemRes.rows.length === 0) {
    throw new Error('Item not found');
  }
  const item = itemRes.rows[0] as { id: string; user_id: string; itemName: string };
  const receiverId = item.user_id;

  if (senderId === receiverId) {
    throw new Error('Cannot contact yourself');
  }

  const dupRes = await dbQuery(
    `SELECT id FROM contact_requests WHERE item_id = $1 AND sender_id = $2 AND status = 'pending' LIMIT 1`,
    [data.itemId, senderId]
  );
  if (dupRes.rows.length > 0) {
    throw new Error('Duplicate request');
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  const result = await dbQuery(
    `INSERT INTO contact_requests (id, item_id, sender_id, receiver_id, message, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, 'pending', $6, $6)
     RETURNING id, item_id AS "itemId", sender_id AS "senderId", receiver_id AS "receiverId", message, status, created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id, data.itemId, senderId, receiverId, data.message, now]
  );
  const row = result.rows[0] as ContactRequest;
  return { ...row, itemName: item.itemName };
}

export async function getContactRequestsForUser(userId: string): Promise<ContactRequest[]> {
  const result = await dbQuery(
    `SELECT
       cr.id,
       cr.item_id AS "itemId",
       i.name AS "itemName",
       cr.sender_id AS "senderId",
       u1.name AS "senderName",
       cr.receiver_id AS "receiverId",
       u2.name AS "receiverName",
       cr.message,
       cr.status,
       cr.created_at AS "createdAt",
       cr.updated_at AS "updatedAt"
     FROM contact_requests cr
     JOIN items i ON i.id = cr.item_id
     JOIN users u1 ON u1.id = cr.sender_id
     JOIN users u2 ON u2.id = cr.receiver_id
     WHERE cr.sender_id = $1 OR cr.receiver_id = $1
     ORDER BY cr.created_at DESC`,
    [userId]
  );
  const rows = result.rows as ContactRequest[];
  return rows.map((row) => ({
    ...row,
     role: row.senderId === userId ? 'sender' : 'receiver',
  }));
}

export async function getContactRequestById(
  id: string,
  userId: string
): Promise<ContactRequest | null> {
  const result = await dbQuery(
    `SELECT
       cr.id,
       cr.item_id AS "itemId",
       i.name AS "itemName",
       cr.sender_id AS "senderId",
       u1.name AS "senderName",
       cr.receiver_id AS "receiverId",
       u2.name AS "receiverName",
       cr.message,
       cr.status,
       cr.created_at AS "createdAt",
       cr.updated_at AS "updatedAt"
     FROM contact_requests cr
     JOIN items i ON i.id = cr.item_id
     JOIN users u1 ON u1.id = cr.sender_id
     JOIN users u2 ON u2.id = cr.receiver_id
     WHERE cr.id = $1`,
    [id]
  );

  if (result.rows.length === 0) return null;
  const row = result.rows[0] as ContactRequest;
  if (!isParticipant(row, userId)) return null;
  return { ...row, role: row.senderId === userId ? 'sender' : 'receiver' };
}

export async function updateContactRequest(
  id: string,
  userId: string,
  newStatus: string
): Promise<ContactRequest | null> {
  const current = await getContactRequestById(id, userId);
  if (!current) return null;

  if (!isParticipant(current, userId)) {
    throw new Error('Unauthorized');
  }

  const isReceiver = current.receiverId === userId;
  const isSender = current.senderId === userId;
  const fromStatus = current.status;

  // Define who may move the status to what.
  // - Receiver acts on incoming requests: pending -> accepted | declined
  // - Sender may withdraw a pending request (pending -> closed)
  // - Either participant may close an accepted request (accepted -> closed)
  if (isReceiver && fromStatus === 'pending') {
    if (newStatus !== 'accepted' && newStatus !== 'declined') {
      throw new Error('Invalid transition');
    }
  } else if (isSender && fromStatus === 'pending') {
    if (newStatus !== 'closed') {
      throw new Error('Invalid transition');
    }
  } else if (fromStatus === 'accepted') {
    if (!isReceiver && !isSender) {
      throw new Error('Unauthorized');
    }
    if (newStatus !== 'closed') {
      throw new Error('Invalid transition');
    }
  } else {
    // pending->closed by sender is covered above; everything else falls to the
    // generic transition table (e.g. declined->closed).
    if (!isValidTransition(fromStatus, newStatus)) {
      throw new Error('Invalid transition');
    }
  }

  const result = await dbQuery(
    `UPDATE contact_requests
     SET status = $1, updated_at = $2
     WHERE id = $3
     RETURNING id, item_id AS "itemId", sender_id AS "senderId", receiver_id AS "receiverId", message, status, created_at AS "createdAt", updated_at AS "updatedAt"`,
    [newStatus, new Date().toISOString(), id]
  );

  if (result.rows.length === 0) return null;
  const updated = result.rows[0] as ContactRequest;

  const senderRes = await dbQuery(`SELECT name FROM users WHERE id = $1`, [updated.senderId]);
  const receiverRes = await dbQuery(`SELECT name FROM users WHERE id = $1`, [updated.receiverId]);
  const itemRes = await dbQuery(`SELECT name FROM items WHERE id = $1`, [updated.itemId]);
  return {
    ...updated,
    role: userId === updated.senderId ? 'sender' : 'receiver',
    senderName: senderRes.rows[0]?.name,
    receiverName: receiverRes.rows[0]?.name,
    itemName: itemRes.rows[0]?.name,
  };
}
