import { query as dbQuery } from '../db';
import { randomUUID } from 'crypto';
import type { Item, CreateItemRequest, ItemFilters } from '../types/item';

const PUBLIC_ITEM_SELECT = `id, name, status, category, description, location, date, image, reporter_name AS "reporterName", user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"`;
const OWNER_ITEM_SELECT = `id, name, status, category, description, location, date, image, reporter_name AS "reporterName", contact, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"`;
const ITEM_SELECT = OWNER_ITEM_SELECT;

export async function getItems(filters: ItemFilters): Promise<Item[]> {
  const {
    status,
    category,
    location,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 50,
    offset = 0,
  } = filters;

  const conditions: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (status) {
    conditions.push(`status = $${i++}`);
    values.push(status);
  }
  if (category) {
    conditions.push(`category = $${i++}`);
    values.push(category);
  }
  if (location) {
    conditions.push(`location = $${i++}`);
    values.push(location);
  }
  if (search) {
    conditions.push(`(name ILIKE $${i} OR description ILIKE $${i})`);
    values.push(`%${search}%`);
    i++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderColumn = sortBy === 'name' ? 'name' : sortBy === 'date' ? 'date' : 'created_at';
  const order = sortOrder === 'asc' ? 'ASC' : 'DESC';

  const text = `
    SELECT ${PUBLIC_ITEM_SELECT}
    FROM items
    ${whereClause}
    ORDER BY ${orderColumn} ${order}
    LIMIT $${i} OFFSET $${i + 1}
  `;
  values.push(limit, offset);

  const result = await dbQuery(text, values);
  return result.rows as Item[];
}

export async function getItemsByUser(userId: string, filters: ItemFilters): Promise<Item[]> {
  const {
    status,
    category,
    location,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 50,
    offset = 0,
  } = filters;

  const conditions: string[] = [`user_id = $1`];
  const values: unknown[] = [userId];
  let i = 2;

  if (status) {
    conditions.push(`status = $${i++}`);
    values.push(status);
  }
  if (category) {
    conditions.push(`category = $${i++}`);
    values.push(category);
  }
  if (location) {
    conditions.push(`location = $${i++}`);
    values.push(location);
  }
  if (search) {
    conditions.push(`(name ILIKE $${i} OR description ILIKE $${i})`);
    values.push(`%${search}%`);
    i++;
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;
  const orderColumn = sortBy === 'name' ? 'name' : sortBy === 'date' ? 'date' : 'created_at';
  const order = sortOrder === 'asc' ? 'ASC' : 'DESC';

  const text = `
    SELECT ${OWNER_ITEM_SELECT}
    FROM items
    ${whereClause}
    ORDER BY ${orderColumn} ${order}
    LIMIT $${i} OFFSET $${i + 1}
  `;
  values.push(limit, offset);

  const result = await dbQuery(text, values);
  return result.rows as Item[];
}

export async function getItemById(id: string, options: { includeContact?: boolean } = {}): Promise<Item | null> {
  const select = options.includeContact ? OWNER_ITEM_SELECT : PUBLIC_ITEM_SELECT;
  const result = await dbQuery(
    `SELECT ${select} FROM items WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) return null;
  return result.rows[0] as Item;
}

export async function createItem(data: CreateItemRequest): Promise<Item> {
  const id = randomUUID();
  const values = [
    id,
    data.userId,
    data.name,
    data.status,
    data.category,
    data.description,
    data.location,
    data.date,
    data.image,
    data.reporterName,
    data.contact,
  ];
  const result = await dbQuery(
    `INSERT INTO items (id, user_id, name, status, category, description, location, date, image, reporter_name, contact)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING ${ITEM_SELECT}`,
    values
  );
  return result.rows[0] as Item;
}
