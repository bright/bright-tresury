import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { BlockchainAddressService } from '../../../users/blockchainAddress/blockchainAddress.service'
import { UsersService } from '../../../users/users.service'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { CacheManager } from '../../../cache/cache.manager'
import { SignMessageService } from '../signMessage/sign-message.service'
import { SignatureValidator } from '../signMessage/signature.validator'
import { ConfirmWeb3AssociateRequestDto } from './dto/confirm-web3-associate-request.dto'
import { SessionData } from '../../session/session.decorator'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'

@Injectable()
export class Web3AssociateService extends SignMessageService<ConfirmWeb3AssociateRequestDto> {
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

    onMessageConfirmed = async (confirmRequest: ConfirmWeb3AssociateRequestDto, res: Response) => {
        await this.userService.associateBlockchainAddress(confirmRequest.session.user, confirmRequest.address)
    }

    async confirmAssociateAddress(
        confirmRequest: ConfirmSignMessageRequestDto,
        res: Response,
        session: SessionData,
    ): Promise<void> {
        return this.confirmSignMessage(
            {
                ...confirmRequest,
                session,
            },
            res,
        )
    }
}
