import type {
	ISessionStore,
	SessionKey,
} from "@application/services/session-store";

export abstract class AuthenticatedUseCase {
	constructor(protected readonly sessionService: ISessionStore) {}

	protected async requireSession(sessionKey: SessionKey){
        await this.sessionService.validate(sessionKey)
        await this.sessionService.refresh(sessionKey)
    }
}
