import z from "zod";

export const userSignUpSchema = z
  .object({
    username: z.string().max(25).regex(/^[a-zA-Z0-9_-]{3,15}$/),
    email: z.email().max(30),
    password: z
      .string().max(15)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()=_+}{":;'\[\]]{8,}$/
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password do not match",
    path: ["passwordConfirm"],
  });
