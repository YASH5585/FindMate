import type { newDb } from 'pg-mem';

/**
 * Registers PostgreSQL functions used by the session store / app that
 * pg-mem does not implement natively. This is ONLY for local in-memory
 * development and tests; a real PostgreSQL instance provides these.
 */
export function registerExtensions(memDb: ReturnType<typeof newDb>): void {
  const db = memDb as any;
  try {
    db.public.registerFunction({
      name: 'to_timestamp',
      impl: (val: string | number) => {
        const num = typeof val === 'number' ? val : Number(val);
        const d = new Date(num * 1000);
        return d;
      },
      returns: 'timestamp',
    });
  } catch {
    // already registered
  }
}

export default registerExtensions;
