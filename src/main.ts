import Fastify from "fastify";

import startDb from "./db-connection.ts";
import { UserSignupController } from "./controllers/auth-controllers/signup-controller.ts";
import { SignupUseCase } from "./application/auth-use-cases/signup-use-case.ts";
import { UserRepository } from "./infrastructure/postgresql-repositories/user-repository.ts";
import { authRoutes } from "./routes/fastify-routes/auth-routes.ts";

import "dotenv/config";

const fastify = Fastify();
const PORT = parseInt(process.env.PORT || "") || 3000;

const sqlClient = await startDb();
const userRepository = new UserRepository(sqlClient);
const userSignupUseCase = new SignupUseCase(userRepository);
const userSignupController = new UserSignupController(userSignupUseCase);

fastify.register(authRoutes({ userSignupController }), {
  prefix: "/api",
});

fastify.listen({ port: PORT }, (err, addr) => {
  if (err) {
    console.log(`error happened at server launch: ${err}`);
    process.exit(1);
  }
  console.log(`Server started at ${addr}`);
});
