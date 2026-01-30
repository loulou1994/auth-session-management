import postgres from "postgres";

export async function startDb() {
	const sql = postgres(process.env.DATABASE_URL!);
	await sql`SELECT 1;`;
	return sql;
}
