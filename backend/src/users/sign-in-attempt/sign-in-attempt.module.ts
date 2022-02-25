import { DatabaseModule } from '../../database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { SignInAttemptService } from './sign-in-attempt.service'
import { SignInAttemptEntity } from './sign-in-attempt.entity'
import { UserEntity } from '../entities/user.entity'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity, SignInAttemptEntity])],
    providers: [SignInAttemptService],
    exports: [SignInAttemptService],
    controllers: [],
})
export class SignInAttemptModule {}
