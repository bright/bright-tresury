import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user.entity'
import { UsersService } from '../users.service'
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto'

@Injectable()
export class UserSettingsService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async update(userId: string, dto: UpdateUserSettingsDto): Promise<User> {
        const user = await this.usersService.findOne(userId)
        if (dto.isEmailNotificationEnabled !== undefined && dto.isEmailNotificationEnabled !== null) {
            user.isEmailNotificationEnabled = dto.isEmailNotificationEnabled
        }
        await this.userRepository.save(user)
        return user
    }
}
