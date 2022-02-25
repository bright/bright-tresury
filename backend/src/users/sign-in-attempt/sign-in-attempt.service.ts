import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { SignInAttemptEntity } from './sign-in-attempt.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../entities/user.entity'

const TEN_MINUTES = 10 * 60 * 1000
const ALLOWED_TRIES = 5

@Injectable()
export class SignInAttemptService {
    private static lockoutPeriodReached = (attemptDate: Date): boolean =>
        Date.now() - attemptDate!.getTime() > TEN_MINUTES
    constructor(
        @InjectRepository(SignInAttemptEntity)
        private readonly repository: Repository<SignInAttemptEntity>,
    ) {}

    private findOneByUser(user: UserEntity) {
        return this.repository.findOne({ where: { user } })
    }

    async isLockedOut(user: UserEntity) {
        const signInAttempt = await this.findOneByUser(user)
        if (!signInAttempt) {
            return false
        }
        const { count, attemptedAt } = signInAttempt
        if (count < ALLOWED_TRIES) return false

        if (SignInAttemptService.lockoutPeriodReached(attemptedAt!)) return false

        return true
    }

    async clearSignInAttemptCount(user: UserEntity) {
        const signInAttempt = (await this.findOneByUser(user)) ?? this.repository.create({ user })
        return this.repository.save({ ...signInAttempt, count: 0, attemptedAt: new Date() })
    }

    async updateSignInAttemptCountAfterWrongTry(user: UserEntity) {
        const signInAttempt = (await this.findOneByUser(user)) ?? this.repository.create({ user })
        const { count = 0, attemptedAt } = signInAttempt
        /*
            we give a user ALLOWED_TRIES tries to enter the  correct password
            if he fails to enter the correct time he needs to wait until lockout period is reached and we restart the counting
            we freeze the counter when he is still in the lockoutPeriod
         */

        let newCount
        if (count < ALLOWED_TRIES) newCount = count + 1
        else if (SignInAttemptService.lockoutPeriodReached(attemptedAt!)) newCount = 1
        else return signInAttempt

        return this.repository.save({ ...signInAttempt, count: newCount, attemptedAt: new Date() })
    }
}
