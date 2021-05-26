import { BadRequestException, Injectable } from '@nestjs/common'
import { BlockchainAddressesService } from '../../../users/blockchainAddresses/blockchainAddresses.service'
import { UsersService } from '../../../users/users.service'
import { SessionData } from '../../session/session.decorator'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'
import { SignMessageService } from '../signMessage/sign-message.service'
import { StartSignMessageResponseDto } from '../signMessage/start-sign-message-response.dto'
import { StartWeb3AssociateRequestDto } from './dto/start-web3-associate-request.dto'

@Injectable()
export class Web3AssociateService {
    constructor(
        private readonly userService: UsersService,
        private readonly blockchainAddressService: BlockchainAddressesService,
        private readonly signMessageService: SignMessageService,
        private readonly superTokensService: SuperTokensService,
    ) {}

    private readonly cacheKey = 'Web3AssociateMessage'

    async start(dto: StartWeb3AssociateRequestDto, { user }: SessionData): Promise<StartSignMessageResponseDto> {
        if (user.isEmailPasswordEnabled) {
            if (!dto.password) {
                throw new BadRequestException('Please provide password for this user')
            }
            await this.superTokensService.verifyPassword(user.email, dto.password)
        }
        const hasAnyWeb3Address = await this.blockchainAddressService.hasAnyAddresses(user.id)
        if (!hasAnyWeb3Address) {
            if (!user.email) {
                throw new BadRequestException('No email or Web3 address associated with this user')
            }
        }

        return this.signMessageService.start(dto, this.cacheKey)
    }

    async confirm(dto: ConfirmSignMessageRequestDto, { user }: SessionData): Promise<void> {
        await this.userService.validateAssociateAddress(dto.address)
        await this.signMessageService.confirm(dto, this.cacheKey)
        await this.userService.associateBlockchainAddress(user, dto.address)
    }
}
