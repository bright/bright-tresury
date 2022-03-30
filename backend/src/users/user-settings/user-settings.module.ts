import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../../auth/session/session.module'
import { SuperTokensModule } from '../../auth/supertokens/supertokens.module'
import { DatabaseModule } from '../../database/database.module'
import { UserEntity } from '../entities/user.entity'
import { UsersModule } from '../users.module'
import { UserSettingsController } from './user-settings.controller'
import { UserSettingsService } from './user-settings.service'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity]), UsersModule, SessionModule, SuperTokensModule],
    providers: [UserSettingsService],
    exports: [UserSettingsService],
    controllers: [UserSettingsController],
})
export class UserSettingsModule {}
