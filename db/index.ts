import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getRawDb(): D1Database {
  if (!env.DB) throw new Error('Study database unavailable');
  return env.DB;
}

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(env.DB, { schema });
}

/** Cloudflare Email Service (the `EMAIL` binding; only in the deployed site, see vite.config.ts). */
export type Mailer = { send(message: { to: string; from: string; subject: string; text: string; html: string }): Promise<unknown> };
export function getMailer(): Mailer | null {
  const mailer = (env as unknown as { EMAIL?: Mailer }).EMAIL;
  return mailer && typeof mailer.send === 'function' ? mailer : null;
}
