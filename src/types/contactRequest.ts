export type ContactRequestStatus = 'pending' | 'accepted' | 'declined' | 'closed';

export interface ContactRequest {
  id: string;
  itemId: string;
  itemName?: string;
  senderId: string;
  senderName?: string;
  receiverId: string;
  receiverName?: string;
  message: string;
  status: ContactRequestStatus;
  createdAt?: string;
  updatedAt?: string;
  role?: 'sender' | 'receiver';
}
