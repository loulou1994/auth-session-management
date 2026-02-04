import type {
	ISessionStore,
	SessionKey,
} from "@application/services/session-store";
import type { IUseCase } from "@application/shared/types";

export class LogoutUseCase implements IUseCase<SessionKey, Promise<void>> {
	private sessionService: ISessionStore;

	constructor(sessionService: ISessionStore) {
		this.sessionService = sessionService;
	}
	async execute(sessionKey: SessionKey) {
		await this.sessionService.validate(sessionKey);
		await this.sessionService.revoke(sessionKey);
	}
}
