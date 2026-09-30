import { query as dbQuery } from '../db';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { User, SafeUser, RegisterRequest, LoginRequest } from '../types/auth';
import { AppError } from '../middleware/errorHandler';

async function getUserByEmail(email: string): Promise<User | null> {
  const result = await dbQuery(
    'SELECT id, email, name, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0] as User;
}

export async function registerUser(data: RegisterRequest): Promise<SafeUser> {
  const existing = await getUserByEmail(data.email);
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const id = randomUUID();

  const result = await dbQuery(
    `INSERT INTO users (id, email, password_hash, name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id, data.email.toLowerCase(), passwordHash, data.name]
  );

  const user = result.rows[0] as User;
  return toSafeUser(user);
}

export async function verifyCredentials(data: LoginRequest): Promise<User | null> {
  const result = await dbQuery(
    'SELECT id, email, name, password_hash AS "passwordHash", created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE email = $1',
    [data.email.toLowerCase()]
  );
  if (result.rows.length === 0) return null;

  const user = result.rows[0] as User & { passwordHash: string };
  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await dbQuery(
    'SELECT id, email, name, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE id = $1',
    [id]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0] as User;
}

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
