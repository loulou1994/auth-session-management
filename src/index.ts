import Fastify from "fastify"
import fastifyPostgres from "@fastify/postgres"
import fastifyPlugin from "fastify-plugin"

const pgPluginWrapper = fastifyPlugin((fastify, opts, done) => {
    // fastify.decorate('util', function () {console.log('hello man')})
    fastify.register(fastifyPostgres, {
        connectionString: "postgres://postgres:loulou1994@localhost/auth_session_db"
    })
    done()
})

const fastify = Fastify({
    logger: true,
})


fastify.register(pgPluginWrapper)

async function queryDb() {
    // @ts-ignore
    console.log(fastify.pg)
    // const client = await fastify.pg.connect()

    // try {
    //     const {rows} = client.query("SELECT FROM user")
        
    //     console.log("performed query!")
    //     return rows
    // } finally {
    //     client.release()
    // }
}

queryDb()
fastify.listen({port: 3000}, (err, address) => {
    // if (err) {
    //     fastify.log.error(err)
    //     process.exit(1)
    // }

    // fastify.pg.connect(onConnect)

    // // @ts-ignore
    // function onConnect(err, client, release) {
    //     if (err) return err
    //     console.log("db connected")
    // }

    // fastify.log.info(`server listening on ${address}`)
})