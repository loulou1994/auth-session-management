import { UserSignupController } from "../../../controllers/auth-controllers/signup-controller.ts";

export type AuthControllers = {
  userSignupController: UserSignupController;
};

export interface IRouteModule<Deps, Framework> {
  (deps: Deps): (
    webFrameworkIns: Framework,
    ...args: any[]
  ) => void | Promise<void>;
}
