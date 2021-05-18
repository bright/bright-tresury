import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { User as SuperTokensUser } from 'supertokens-node/lib/build/recipe/emailpassword/types'
import { Response } from 'express'
import { v4 as uuid } from 'uuid'
import { SignMessageService } from '../signMessage/sign-message.service'
import { StartSignMessageResponseDto } from '../signMessage/start-sign-message-response.dto'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'
import { UsersService } from '../../../users/users.service'
import { BlockchainAddressService } from '../../../users/blockchainAddress/blockchainAddress.service'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { CacheManager } from '../../../cache/cache.manager'
import { isValidAddress } from '../../../utils/address/address.validator'
import { CreateBlockchainUserDto } from '../../../users/dto/createBlockchainUser.dto'
import { StartSignMessageRequestDto } from '../signMessage/start-sign-message-request.dto'
import { SignatureValidator } from '../signMessage/signature.validator'
import { ConfirmWeb3SignUpRequestDto } from './dto/confirm-web3-sign-up-request.dto'

@Injectable()
export class Web3SignUpService extends SignMessageService<ConfirmWeb3SignUpRequestDto> {
    constructor(
        private readonly userService: UsersService,
        private readonly blockchainAddressService: BlockchainAddressService,
        private readonly superTokensService: SuperTokensService,
        cacheManager: CacheManager,
        signatureValidator: SignatureValidator,
    ) {
        super(cacheManager, signatureValidator)
    }

    async startSignMessage(startRequest: StartSignMessageRequestDto): Promise<StartSignMessageResponseDto> {
        await this.validateAddress(startRequest.address)
        return super.startSignMessage(startRequest)
    }

    async confirmSignMessage(confirmRequest: ConfirmWeb3SignUpRequestDto, res: Response): Promise<void> {
        await this.validateAddress(confirmRequest.address)
        return super.confirmSignMessage(confirmRequest, res)
    }

    getCacheKey = (address: string) => `SignUpMessage:${address}`

    onMessageConfirmed = async (confirmRequest: ConfirmSignMessageRequestDto, res: Response) => {
        await this.createBlockchainUser(confirmRequest.address, res)
    }

    private async validateAddress(address: string) {
        const isValid = isValidAddress(address)
        if (!isValid) {
            throw new BadRequestException('Incorrect address')
        }
        const doesAddressExist = await this.blockchainAddressService.doesAddressExist(address)
        if (doesAddressExist) {
            throw new ConflictException('User with this address already exists')
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
}
