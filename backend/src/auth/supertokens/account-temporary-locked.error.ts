import SuperTokensError from 'supertokens-node/lib/build/error'
export const ACCOUNT_TEMPORARY_LOCKED = 'ACCOUNT_TEMPORARY_LOCKED'
export class AccountTemporaryLockedError extends SuperTokensError {
    constructor() {
        super({message: ACCOUNT_TEMPORARY_LOCKED, type: ACCOUNT_TEMPORARY_LOCKED});
    }
}
