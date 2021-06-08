import { Module } from '@nestjs/common'
import { SignMessageService } from './sign-message.service'
import { SignatureValidator } from './signature.validator'
import { CachingModule } from '../../../cache/cache.module'

@Module({
    imports: [CachingModule],
    providers: [SignatureValidator, SignMessageService],
    exports: [SignatureValidator, SignMessageService],
})
export class Web3SignMessageModule {}
