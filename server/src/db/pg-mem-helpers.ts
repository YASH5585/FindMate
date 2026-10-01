import type { newDb } from 'pg-mem';

/**
 * Registers PostgreSQL functions used by the session store / app that
 * pg-mem does not implement natively. This is ONLY for local in-memory
 * development and tests; a real PostgreSQL instance provides these.
 */
export function registerExtensions(memDb: ReturnType<typeof newDb>): void {
  const db = memDb as any;
  const register = (name: string, impl: (...args: unknown[]) => unknown, returns: string) => {
    try {
      db.public.registerFunction({ name, impl, returns });
    } catch {
      // already registered
    }
  };

  register('to_timestamp', (...args: unknown[]) => {
    const val = args[0] as string | number | undefined;
    if (val === undefined) return null;
    const num = typeof val === 'number' ? val : Number(val);
    return new Date(num * 1000);
  }, 'timestamp');
}

export default registerExtensions;
