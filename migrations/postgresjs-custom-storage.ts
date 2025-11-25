import postgres from "postgres";
import type { UmzugStorage } from "umzug";

export class PostgresMigrationStorage implements UmzugStorage {
  private sql: postgres.Sql<{}>;
  private table: string;

  constructor(sql: postgres.Sql<{}>, tablename: string = "migrations") {
    this.sql = sql;
    this.table = tablename;
  }

  async init(): Promise<void> {
    await this.sql`CREATE TABLE IF NOT EXISTS ${this.sql(this.table)} (
      name TEXT PRIMARY KEY,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    );`;
  }

  async logMigration({ name }: { name: string }): Promise<void> {
    await this.sql`INSERT INTO ${this.sql(this.table)} (name)
      VALUES (${name}) ON CONFLICT DO NOTHING;
    `;
  }

  async unlogMigration({ name }: { name: string }): Promise<void> {
    await this.sql`DELETE FROM ${this.sql(this.table)} WHERE name = ${name};`;
  }

  async executed(): Promise<string[]> {
    await this.init()
    const rows = await this.sql`SELECT name FROM
      ${this.sql(this.table)} ORDER BY executed_at ASC;`;

    return rows.map((r) => r.name);
  }
}
