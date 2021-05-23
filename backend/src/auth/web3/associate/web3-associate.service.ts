import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { UsersService } from '../../../users/users.service'
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
        cacheManager: CacheManager,
        signatureValidator: SignatureValidator,
    ) {
        super(cacheManager, signatureValidator)
    }

    getCacheKey = (address: string) => `Web3AssociateMessage:${address}`

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
