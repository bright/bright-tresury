import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import { ConfirmSignMessageRequestDto } from '../signingMessage/confirm-sign-message-request.dto'
import { BlockchainAddressService } from '../../../users/blockchainAddress/blockchainAddress.service'
import { UsersService } from '../../../users/users.service'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { CacheManager } from '../../../cache/cache.manager'
import { isValidAddress } from '../../../utils/address/address.validator'
import { SignMessageService } from '../signingMessage/sign-message.service'
import { SignatureValidator } from '../signingMessage/signature.validator'

@Injectable()
export class AuthWeb3SignInService extends SignMessageService {
    constructor(
        private readonly userService: UsersService,
        private readonly blockchainAddressService: BlockchainAddressService,
        private readonly superTokensService: SuperTokensService,
        cacheManager: CacheManager,
        signatureValidator: SignatureValidator,
    ) {
        super(cacheManager, signatureValidator)
    }

    getCacheKey = (address: string) => `SignInMessage:${address}`

    onMessageConfirmed = async (confirmRequest: ConfirmSignMessageRequestDto, res: Response) => {
        /**
         * Validation can return response to the user that can inform if there is any user associated
         * with the requested address. We validate it only if user signs the message successfully, because
         * then we are sure that this user owns the address and can obtain information regarding associated account.
         */
        await this.validateAddress(confirmRequest.address)
        const user = await this.userService.findOneByBlockchainAddress(confirmRequest.address)
        await this.superTokensService.createSession(res, user.authId)
    }

    private async validateAddress(address: string) {
        const isValid = isValidAddress(address)
        if (!isValid) {
            throw new BadRequestException('Incorrect address')
        }
        const doesAddressExist = await this.blockchainAddressService.doesAddressExist(address)
        if (!doesAddressExist) {
            throw new NotFoundException('There is no user associated with this address')
        }
    }
}
