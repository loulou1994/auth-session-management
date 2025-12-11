import postgres from "postgres"

async function startDb(){
    try {
        const sql = postgres(process.env.DATABASE_URL!)
        await sql`SELECT 1;`
        return sql
    } catch (err) {
        console.log(`Failed to establish database connection: ${err}`)
        process.exit(1)
    }
}

export default startDb