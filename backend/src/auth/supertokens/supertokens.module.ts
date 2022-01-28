import { forwardRef, Module } from '@nestjs/common'
import { EmailsModule } from '../../emails/emails.module'
import { SuperTokensService } from './supertokens.service'
import { UsersModule } from '../../users/users.module'
import { TypeOrmAuthorizationModule } from '../../database/authorization/authorization.database.module'

@Module({
    imports: [forwardRef(() => UsersModule), EmailsModule, TypeOrmAuthorizationModule],
    providers: [SuperTokensService],
    exports: [SuperTokensService],
})
export class SuperTokensModule {}
