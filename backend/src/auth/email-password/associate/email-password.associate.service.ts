import {Injectable} from '@nestjs/common'
import {BlockchainAddressService} from '../../../users/blockchainAddress/blockchainAddress.service'
import {UsersService} from '../../../users/users.service'
import {SessionData} from "../../session/session.decorator";
import {SuperTokensService} from '../../supertokens/supertokens.service'
import {SignMessageService} from '../../web3/signMessage/sign-message.service';
import {StartSignMessageResponseDto} from "../../web3/signMessage/start-sign-message-response.dto";
import {ConfirmEmailPasswordAssociateRequestDto} from "./dto/confirm.request.dto";
import {EmailPasswordAssociateRequestDetails} from "./dto/request-details.dto";
import {StartEmailPasswordAssociateRequestDto} from './dto/start.request.dto';

@Injectable()
export class EmailPasswordAssociateService {
    constructor(
        private readonly userService: UsersService,
        private readonly blockchainAddressService: BlockchainAddressService,
        private readonly superTokensService: SuperTokensService,
        private readonly signMessageService: SignMessageService,
    ) {
    }

    private readonly cacheKey = 'AssociateEmailPasswordMessage'

    async start(dto: StartEmailPasswordAssociateRequestDto): Promise<StartSignMessageResponseDto> {
        await this.validate(dto.details)
        return this.signMessageService.start(dto, this.cacheKey)
    }

    async confirm(dto: ConfirmEmailPasswordAssociateRequestDto, sessionData: SessionData): Promise<void> {
        await this.validate(dto.details)
        await this.signMessageService.confirm(dto, this.cacheKey)
        await this.superTokensService.updateEmail(sessionData.user.authId, dto.details.email)
        await this.superTokensService.updatePassword(sessionData.user.authId, dto.details.password)
        await this.userService.associateEmailAccount(sessionData.user.id, {...dto.details})
    }

    private async validate(details: EmailPasswordAssociateRequestDetails) {
        await this.userService.validateUsername(details.username)
        await this.userService.validateEmail(details.email)
    }
}
