import { Module } from '@nestjs/common'
import { VerifyEmailController } from './verify-email.controller'
import { SuperTokensModule } from '../../supertokens/supertokens.module'

@Module({
    imports: [SuperTokensModule],
    controllers: [VerifyEmailController],
})
export class VerifyEmailModule {}
