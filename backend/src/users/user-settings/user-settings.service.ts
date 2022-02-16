import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../user.entity'
import { UsersService } from '../users.service'
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto'

@Injectable()
export class UserSettingsService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async update(userId: string, dto: UpdateUserSettingsDto): Promise<UserEntity> {
        const user = await this.usersService.findOneOrThrow(userId)
        if (dto.isEmailNotificationEnabled !== undefined && dto.isEmailNotificationEnabled !== null) {
            user.isEmailNotificationEnabled = dto.isEmailNotificationEnabled
        }
        await this.userRepository.save(user)
        return user
    }
}
