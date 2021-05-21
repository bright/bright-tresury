import {BadRequestException, Injectable} from '@nestjs/common'
import {BlockchainAddressService} from '../../../users/blockchainAddress/blockchainAddress.service'
import {User} from '../../../users/user.entity'
import {UsersService} from '../../../users/users.service'
import {SessionData} from '../../session/session.decorator'
import {SuperTokensService} from '../../supertokens/supertokens.service'
import {ConfirmSignMessageRequestDto} from '../signMessage/confirm-sign-message-request.dto'
import {SignMessageService} from '../signMessage/sign-message.service'
import {StartSignMessageResponseDto} from '../signMessage/start-sign-message-response.dto'
import {StartWeb3AssociateRequestDto} from './dto/start-web3-associate-request.dto'

@Injectable()
export class Web3AssociateService {
    constructor(
        private readonly userService: UsersService,
        private readonly blockchainAddressService: BlockchainAddressService,
        private readonly signMessageService: SignMessageService,
        private readonly superTokensService: SuperTokensService,
    ) {}

    private readonly cacheKey = 'Web3AssociateMessage'

    async start(
        dto: StartWeb3AssociateRequestDto,
        user: User,
    ): Promise<StartSignMessageResponseDto> {
        await this.userService.validateAssociateAddress(dto.address)

        const hasAnyWeb3Address = await this.blockchainAddressService.hasAnyAddresses(user.id)
        if (!hasAnyWeb3Address) {
            if (!user.email) {
                throw new BadRequestException('No email address associated with this user')
            }
            await this.superTokensService.verifyPassword(user.email, dto.password)
        }


        return this.signMessageService.start(dto, this.cacheKey)
    }

    async confirm(dto: ConfirmSignMessageRequestDto, sessionData: SessionData): Promise<void> {
        await this.signMessageService.confirm(dto, this.cacheKey)
        await this.userService.associateBlockchainAddress(sessionData.user, dto.address)
    }
}
