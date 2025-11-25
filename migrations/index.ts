import { readFileSync } from "node:fs";
import postgres from "postgres";
import { Umzug } from "umzug";

import { PostgresMigrationStorage } from "./postgresjs-custom-storage.ts";

const sql = postgres(
  "postgres://loulou1994:loulou1994@localhost:5432/auth_session_db"
);

(async function () {
  try {
    await sql`SELECT 1;`;

    const umzug = new Umzug({
      context: { sql },
      migrations: {
        glob: import.meta.dirname + "/*.sql",
        resolve: ({ context: { sql }, path, name }) => ({
          name,
          up: async () => {
            const sqlQuery = readFileSync(path!).toString();
            await sql.unsafe(sqlQuery);
          },
          down: async () => {
            const sqlQuery = readFileSync(
              path!.replace("/migrations", "/migrations/down")
            ).toString();
            await sql.unsafe(sqlQuery);
          },
        }),
      },
      storage: new PostgresMigrationStorage(sql),
      logger: console,
      create: {
        folder: import.meta.dirname,
      },
    });

    if (import.meta.main) {
      umzug.runAsCLI().then(() => {
        process.exit(0);
      });
    }
  } catch (err) {
    console.log(`Error while establishing connection to db server: ${err}`);
  }
})();
