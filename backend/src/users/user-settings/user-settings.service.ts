import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SuperTokensService } from '../../auth/supertokens/supertokens.service'
import { UserEntity } from '../entities/user.entity'
import { UsersService } from '../users.service'
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto'

@Injectable()
export class UserSettingsService {
    constructor(
        private readonly usersService: UsersService,
        private readonly superTokensService: SuperTokensService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async update(userId: string, dto: UpdateUserSettingsDto): Promise<UserEntity> {
        const user = await this.usersService.findOneOrThrow(userId)

        if (dto.isEmailNotificationEnabled !== undefined && dto.isEmailNotificationEnabled !== null) {
            user.isEmailNotificationEnabled = dto.isEmailNotificationEnabled
        }
        if (dto.username !== undefined && dto.username !== null) {
            user.username = dto.username
        }

        await this.userRepository.save(user)

        await this.superTokensService.refreshAccessTokenPayloadForUser(user.authId)

        return user
    }
}
