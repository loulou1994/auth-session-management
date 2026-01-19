export const sessionCookieOptions = {
  httpOnly: true,
  expires: 1000 * 60 * 60 * 24 * 7,
  secure: "auto",
  sameSite: "none",
  cookieName: "sid"
} as const;

export const sessionConfig = {
    sessionPrefix: "session",
    hostname: process.env.SESSION_HOSTNAME,
    port: process.env.SESSION_PORT,
    username: process.env.SESSION_USERNAME,
    password: process.env.SESSION_PASSWORD,
} as const