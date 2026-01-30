import type { SessionKey } from "@application/services/session-store";
import type { IUseCase } from "@application/shared/types";
import { AuthenticatedUseCase } from "@application/shared/utils";

export class LogoutUseCase
	extends AuthenticatedUseCase
	implements IUseCase<SessionKey, Promise<void>>
{
	async execute(sessionKey: SessionKey) {
		await this.requireSession(sessionKey);
		await this.sessionService.revoke(sessionKey);
	}
}
