import { LogoutUseCase } from "../../../src/application/auth-use-cases/logout-use-case";
import { sessionKey, sessionService } from "../../utils";

describe("logout use case", () => {
    const logoutUseCase = new LogoutUseCase(sessionService)
    
    it("logs out user and clear the session successfully", async () => {
        const result = await logoutUseCase.execute(sessionKey)

        expect(result).toBe(undefined)
        expect(sessionService.validate).toHaveBeenCalledWith(sessionKey)
        expect(sessionService.revoke).toHaveBeenCalledWith(sessionKey)
    })
})