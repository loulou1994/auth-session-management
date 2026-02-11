import z from "zod";

export const userSignUpSchema = z
	.object({
		username: z
			.string()
			.max(25)
			.regex(/^[a-zA-Z0-9_-]{3,15}$/, {
				error: "Invalid pattern. Follow the instructed pattern",
			}),
		email: z.email().max(30),
		password: z
			.string()
			.max(16)
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()=_+}{":;'[\]]{8,}$/,
				{
					error: "Invalid pattern. Follow the instructed pattern",
				},
			),
		passwordConfirm: z.string(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords do not match",
		path: ["passwordConfirm"],
	});

export const userLoginSchema = z.object({
	email: z.email().max(30),
	password: z.string().max(15),
});

export const sessionCookieSchema = z.object({
	sid: z.string().min(15),
});
