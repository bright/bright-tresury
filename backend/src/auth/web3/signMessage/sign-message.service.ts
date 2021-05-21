import {BadRequestException, Injectable} from '@nestjs/common'
import {v4 as uuid} from 'uuid'
import {CacheManager} from '../../../cache/cache.manager'
import {ConfirmSignMessageRequestDto} from './confirm-sign-message-request.dto'
import {SignatureValidator} from './signature.validator'
import {StartSignMessageRequestDto} from './start-sign-message-request.dto'
import {StartSignMessageResponseDto} from './start-sign-message-response.dto'

@Injectable()
export class SignMessageService {
    /**
     * Sign up message expiration time in seconds
     */
    private readonly SignMessageTtlInSeconds = 5 * 60

    constructor(
        private readonly cacheManager: CacheManager,
        private readonly signatureValidator: SignatureValidator,
    ) {
    }

    async start(startRequest: StartSignMessageRequestDto, cacheKey: string): Promise<StartSignMessageResponseDto> {
        const signMessage = uuid()
        const signMessageKey = this.getCacheKey(startRequest.address, cacheKey)
        await this.cacheManager.set<string>(signMessageKey, signMessage, {ttl: this.SignMessageTtlInSeconds})

        return new StartSignMessageResponseDto(signMessage)
    }

    async confirm(confirmRequest: ConfirmSignMessageRequestDto, cacheKey: string): Promise<void> {
        const signMessageKey = this.getCacheKey(confirmRequest.address, cacheKey)
        const cachedSignMessage = await this.cacheManager.get<string>(signMessageKey)
        if (!cachedSignMessage) {
            throw new BadRequestException('Sign message was not found. Please start signing message before confirming.')
        }

        const signatureValid = this.signatureValidator.validateSignature(cachedSignMessage, confirmRequest)
        if (signatureValid) {
            await this.cacheManager.del(signMessageKey)
        } else {
            throw new BadRequestException('The signature is invalid')
        }
    }

    private getCacheKey(address: string, cacheKey: string): string {
        return `${cacheKey}:${address}`
    }
}
