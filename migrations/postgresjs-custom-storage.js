class PostgresMigrationStorage {
  constructor(sql, tablename = "migrations") {
    this.sql = sql;
    this.table = tablename;
  }

  async init() {
    await this.sql`CREATE TABLE IF NOT EXISTS ${this.sql(this.table)} (
      name TEXT PRIMARY KEY,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    );`;
  }

  async logMigration({ name }) {
    await this.sql`INSERT INTO ${this.sql(this.table)} (name)
      VALUES (${name}) ON CONFLICT DO NOTHING;
    `;
  }

  async unlogMigration({ name }) {
    await this.sql`DELETE FROM ${this.sql(this.table)} WHERE name = ${name};`;
  }

  async executed() {
    await this.init()
    const rows = await this.sql`SELECT name FROM
      ${this.sql(this.table)} ORDER BY executed_at ASC;`;

    return rows.map((r) => r.name);
  }
}

module.exports = PostgresMigrationStorage