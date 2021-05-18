import { Module } from '@nestjs/common'
import { SignatureValidator } from './signature.validator'

@Module({
    providers: [SignatureValidator],
    exports: [SignatureValidator],
})
export class Web3SignMessageModule {}
