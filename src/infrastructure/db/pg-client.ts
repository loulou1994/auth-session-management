import postgres from "postgres"

async function startDb(){
    const sql = postgres('postgres://loulou1994:loulou1994@localhost:5432/auth_session_db')
    await sql`SELECT 1`
}

export default startDb