import { Module } from '@nestjs/common'
import { SessionModule } from '../../session/session.module'
import { VerifyEmailController } from './verify-email.controller'
import { SuperTokensModule } from '../../supertokens/supertokens.module'

@Module({
    imports: [SuperTokensModule, SessionModule],
    controllers: [VerifyEmailController],
})
export class VerifyEmailModule {}
