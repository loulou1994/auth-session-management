const { readFileSync } = require("node:fs");
const postgres = require("postgres");
const { Umzug } = require("umzug");

const PostgresMigrationStorage = require("./postgresjs-custom-storage")

const sql = postgres(process.env.DATABASE_URL || "");

(async function () {
  try {
    await sql`SELECT 1;`;

    const umzug = new Umzug({
      context: { sql },
      migrations: {
        glob: __dirname + "/*.sql",
        resolve: ({ context: { sql }, path, name }) => ({
          name,
          up: async () => {
            const sqlQuery = readFileSync(path).toString();
            await sql.unsafe(sqlQuery);
          },
          down: async () => {
            const sqlQuery = readFileSync(
              path.replace("/migrations", "/migrations/down"),
            ).toString();
            await sql.unsafe(sqlQuery);
          },
        }),
      },
      storage: new PostgresMigrationStorage(sql),
      logger: console,
      create: {
        folder: __dirname,
      },
    });

    if (__dirname) {
      umzug.runAsCLI().then(() => {
        process.exit(0);
      });
    }
  } catch (err) {
    console.log(`Error while establishing connection to db server: ${err}`);
  }
})();
