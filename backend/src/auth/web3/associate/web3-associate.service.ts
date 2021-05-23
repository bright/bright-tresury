import { BadRequestException, Injectable } from '@nestjs/common'
import { Response } from 'express'
import { UsersService } from '../../../users/users.service'
import { CacheManager } from '../../../cache/cache.manager'
import { SignMessageService } from '../signMessage/sign-message.service'
import { SignatureValidator } from '../signMessage/signature.validator'
import { ConfirmWeb3AssociateRequestDto } from './dto/confirm-web3-associate-request.dto'
import { SessionData } from '../../session/session.decorator'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'
import { StartWeb3AssociateRequestDto } from './dto/start-web3-associate-request.dto'
import { StartSignMessageResponseDto } from '../signMessage/start-sign-message-response.dto'
import { BlockchainAddressService } from '../../../users/blockchainAddress/blockchainAddress.service'
import { User } from '../../../users/user.entity'
import { SuperTokensService } from '../../supertokens/supertokens.service'

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

    getCacheKey = (address: string) => `Web3AssociateMessage:${address}`

    onMessageConfirmed = async (confirmRequest: ConfirmWeb3AssociateRequestDto, res: Response) => {
        await this.userService.associateBlockchainAddress(confirmRequest.session.user, confirmRequest.address)
    }

    async startAssociateAddress(
        startRequest: StartWeb3AssociateRequestDto,
        user: User,
    ): Promise<StartSignMessageResponseDto> {
        await this.userService.validateAssociateAddress(startRequest.address)

        const hasAnyWeb3Address = await this.blockchainAddressService.hasAnyAddresses(user.id)
        if (!hasAnyWeb3Address) {
            if (!user.email) {
                throw new BadRequestException('No email address associated with this user')
            }
            await this.superTokensService.verifyPassword(user.email, startRequest.password)
        }

        return super.startSignMessage(startRequest)
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
