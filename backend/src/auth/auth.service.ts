import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { JwtPayload, formatAccountId } from "./jwt.payload";
import { AuthConfig } from "./auth.config";

export interface AccountInfo {
    accountId: string
}

@Injectable()
export class AuthService {
    constructor(@Inject('AuthConfig') private readonly authConfig: AuthConfig) {
    }

    get encryptionKey() {
        return this.authConfig.encryptionKey;
    }

    createToken(accountInfo: AccountInfo) {
        const subject = formatAccountId(accountInfo.accountId);
        const user: JwtPayload = { sub: subject };
        return jwt.sign(user, this.authConfig.encryptionKey, {
            // subject // subject is already present in payload
        });
    }

    async validateAccount(accountInfo: AccountInfo): Promise<AccountInfo | null> {
        return accountInfo
    }
}
