// import Fastify from "fastify";

// import startDb from "./infrastructure/db/pg-client.ts";

// const fastify = Fastify();

// (async function () {
//   try {
//     await startDb();
//     console.log("Db connection established");
//     await fastify.listen({ port: 3000 });
//   } catch (error) {
//     console.log(`Error encountered: ${(error as Error).message}`);
//     process.exit(1);
//   }
// })();

// const newObj = {
//     data: ["age", "engineer"],
//     accessData() {
//         return this.data
//     }
// }