import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { User as SuperTokensUser } from 'supertokens-node/lib/build/recipe/emailpassword/types'
import { Response } from 'express'
import { UsersService } from '../../users/users.service'
import { SuperTokensService } from '../supertokens/supertokens.service'
import { CreateBlockchainUserDto } from '../../users/dto/createBlockchainUser.dto'
import { v4 as uuid } from 'uuid'
import { CacheManager } from '../../cache/cache.manager'
import { decodeAddress, signatureVerify } from '@polkadot/util-crypto'
import { u8aToHex } from '@polkadot/util'
import { BlockchainAddressService } from '../../users/blockchainAddress/blockchainAddress.service'
import { isValidAddress } from '../../utils/address/address.validator'
import { StartWeb3SignRequestDto, StartWeb3SignResponseDto } from './dto/start-web3-sign.dto'
import { ConfirmWeb3SignRequestDto } from './dto/confirm-web3-sign-request.dto'
import { ConfirmWeb3SignUpRequestDto } from './dto/confirm-web3-sign-up-request.dto'

@Injectable()
export class AuthWeb3Service {
    /**
     * Sign up message expiration time in seconds
     */
    private readonly SignMessageTtlInSeconds = 5 * 60

    constructor(
        private readonly userService: UsersService,
        private readonly blockchainAddressService: BlockchainAddressService,
        private readonly superTokensService: SuperTokensService,
        private readonly cacheManager: CacheManager,
    ) {}

    async startSignIn(startDto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
        await this.validateAddressForSignIn(startDto.address)

        const signMessage = uuid()
        const signMessageKey = this.getSignInMessageCacheKey(startDto.address)
        await this.cacheManager.set<string>(signMessageKey, signMessage, { ttl: this.SignMessageTtlInSeconds })

        return new StartWeb3SignResponseDto(signMessage)
    }

    async confirmSignIn(confirmRequest: ConfirmWeb3SignRequestDto, res: Response): Promise<void> {
        await this.validateAddressForSignIn(confirmRequest.address)

        const signMessageKey = this.getSignInMessageCacheKey(confirmRequest.address)
        const cachedSignMessage = await this.cacheManager.get<string>(signMessageKey)
        if (!cachedSignMessage) {
            throw new BadRequestException('Sign message was not found. Please start sign in before confirming.')
        }

        const signatureValid = this.validateSignature(cachedSignMessage, confirmRequest)
        if (signatureValid) {
            const user = await this.userService.findOneByBlockchainAddress(confirmRequest.address)
            await this.superTokensService.createSession(res, user.authId)
            await this.cacheManager.del(signMessageKey)
        } else {
            throw new BadRequestException('The signature is invalid')
        }
    }

    async startSignUp(startDto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
        await this.validateAddress(startDto.address)

        const signMessage = uuid()
        const signMessageKey = this.getSignUpMessageCacheKey(startDto.address)
        await this.cacheManager.set<string>(signMessageKey, signMessage, { ttl: this.SignMessageTtlInSeconds })

        return new StartWeb3SignResponseDto(signMessage)
    }

    async confirmSignUp(confirmRequest: ConfirmWeb3SignUpRequestDto, res: Response): Promise<void> {
        await this.validateAddressForSignUp(confirmRequest.address)

        const signMessageKey = this.getSignUpMessageCacheKey(confirmRequest.address)
        const cachedSignMessage = await this.cacheManager.get<string>(signMessageKey)
        if (!cachedSignMessage) {
            throw new BadRequestException('Sign message was not found. Please start sign up before confirming.')
        }

        const signatureValid = this.validateSignature(cachedSignMessage, confirmRequest)
        if (signatureValid) {
            await this.createBlockchainUser(confirmRequest.address, res)
            await this.cacheManager.del(signMessageKey)
        } else {
            throw new BadRequestException('The signature is invalid')
        }
    }

    validateSignature = (signMessage: string, confirmRequest: ConfirmWeb3SignRequestDto): boolean => {
        const publicAddressKey = decodeAddress(confirmRequest.address)
        const publicHexAddressKey = u8aToHex(publicAddressKey)

        const result = signatureVerify(signMessage, confirmRequest.signature, publicHexAddressKey)
        return result.isValid
    }

    private async validateAddressForSignIn(address: string) {
        await this.validateAddress(address)
        const doesAddressExist = await this.blockchainAddressService.doesAddressExist(address)
        if (!doesAddressExist) {
            throw new NotFoundException('There is no user associated with this address')
        }
    }

    private async validateAddressForSignUp(address: string) {
        await this.validateAddress(address)
        const doesAddressExist = await this.blockchainAddressService.doesAddressExist(address)
        if (doesAddressExist) {
            throw new ConflictException('User with this address already exists')
        }
    }

    private async validateAddress(address: string) {
        const isValid = isValidAddress(address)
        if (!isValid) {
            throw new BadRequestException('Incorrect address')
        }
    }

    private async createBlockchainUser(address: string, res: Response) {
        const userUuid = uuid()
        const password = uuid()

        const superTokensUser: SuperTokensUser = await this.superTokensService.signUp(userUuid, password)
        const createUserDto = {
            authId: superTokensUser.id,
            username: userUuid,
            blockchainAddress: address,
        } as CreateBlockchainUserDto
        await this.userService.createBlockchainUser(createUserDto)
        await this.superTokensService.createSession(res, superTokensUser.id)
    }

    private getSignUpMessageCacheKey = (address: string) => `SignUpMessage:${address}`
    private getSignInMessageCacheKey = (address: string) => `SignInMessage:${address}`
}
