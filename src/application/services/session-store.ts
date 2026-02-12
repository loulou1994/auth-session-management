export type SessionData = {
	userId: string;
	createdAt: number;
};

export type SessionKey = {
	sid: string;
};
export interface ISessionStore {
	create(userId: string): Promise<SessionKey>;
	validate(sessionKey: SessionKey): Promise<void>;
	revoke(sessionKey: SessionKey): Promise<void>;
	refresh(sessionKey: SessionKey): Promise<SessionKey | undefined>;
}
