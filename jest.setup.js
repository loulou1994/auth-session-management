require('dotenv').config()
const {execSync} = require("child_process")

process.env.DATABASE_URL = process.env.DATABASE_URL_TEST

module.exports = async () => {
    execSync("npm run db-migrate-up", { stdio: "inherit" })
}