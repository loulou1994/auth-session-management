import z from "zod";

import { IController } from "../shared/icontroller.ts";

export const userSignUpSchema = z.object({
    username: z.string().regex(/^[a-zA-Z0-9_-]{3,15}$/),
    email: z.email(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+}{":;'\[\]]{8,}$/),
    passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Password do not match",
    path: ["passwordConfirm"]
})

class UserSignupController implements IController {

    execute({body, query}){
        return {
            statusCode: 44654,
            name: "said douidi"
            // cookies: {name: "Monksd"},
        };
    }
}