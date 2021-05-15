import { BadRequestException } from '@nestjs/common'
import { Response } from 'express'
import { v4 as uuid } from 'uuid'
import { StartSignMessageResponseDto } from './start-sign-message-response.dto'
import { CacheManager } from '../../../cache/cache.manager'
import { ConfirmSignMessageRequestDto } from './confirm-sign-message-request.dto'
import { StartSignMessageRequestDto } from './start-sign-message-request.dto'
import { SignatureValidator } from './signature.validator'

export abstract class SignMessageService {
    abstract getCacheKey: (address: string) => string
    abstract onMessageConfirmed: (confirmRequest: ConfirmSignMessageRequestDto, res: Response) => Promise<void>

    /**
     * Sign up message expiration time in seconds
     */
    private readonly SignMessageTtlInSeconds = 5 * 60

    protected constructor(
        private readonly cacheManager: CacheManager,
        private readonly signatureValidator: SignatureValidator,
    ) {}

    async startSigningMessage(startRequest: StartSignMessageRequestDto): Promise<StartSignMessageResponseDto> {
        const signMessage = uuid()
        const signMessageKey = this.getCacheKey(startRequest.address)
        await this.cacheManager.set<string>(signMessageKey, signMessage, { ttl: this.SignMessageTtlInSeconds })

        return new StartSignMessageResponseDto(signMessage)
    }

    async confirmSigningMessage(confirmRequest: ConfirmSignMessageRequestDto, res: Response): Promise<void> {
        const signMessageKey = this.getCacheKey(confirmRequest.address)
        const cachedSignMessage = await this.cacheManager.get<string>(signMessageKey)
        if (!cachedSignMessage) {
            throw new BadRequestException('Sign message was not found. Please start signing message before confirming.')
        }

        const signatureValid = this.signatureValidator.validateSignature(cachedSignMessage, confirmRequest)
        if (signatureValid) {
            await this.onMessageConfirmed(confirmRequest, res)
            await this.cacheManager.del(signMessageKey)
        } else {
            throw new BadRequestException('The signature is invalid')
        }
    }
}
