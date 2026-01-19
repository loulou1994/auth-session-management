export type SessionData = {
  userId: string;
  createdAt: number
}

export type SessionKey = {
  sid: string
}
export interface ISessionStore {
    create(userId: string): Promise<SessionKey>
    // validate(sessionId: string): Promise<boolean>
    // delete(sessionId: string): Promise<void>
    // getSessionPrefix(sessionId: string): string
}
