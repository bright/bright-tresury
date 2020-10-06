import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountInfo, AuthService } from './auth.service';
import { JwtPayload, parseAccountId } from "./jwt.payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: authService.encryptionKey,
        });
    }

    public async validate(payload: JwtPayload, done: (err: Error | null, result: AccountInfo | null) => void) {
        const accountId = parseAccountId(payload);
        const user = await this.authService.validateAccount({ accountId });
        if (!user) {
            return done(new UnauthorizedException(), null);
        }
        done(null, user);
    }
}
