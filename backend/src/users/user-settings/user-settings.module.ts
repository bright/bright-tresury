import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../../auth/session/session.module'
import { DatabaseModule } from '../../database/database.module'
import { User } from '../user.entity'
import { UsersModule } from '../users.module'
import { UserSettingsController } from './user-settings.controller'
import { UserSettingsService } from './user-settings.service'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([User]), UsersModule, SessionModule],
    providers: [UserSettingsService],
    exports: [UserSettingsService],
    controllers: [UserSettingsController],
})
export class UserSettingsModule {}
