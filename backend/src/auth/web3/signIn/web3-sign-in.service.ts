import {
    BadRequestException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { Response } from 'express'
import { Web3AddressesService } from '../../../users/web3-addresses/web3-addresses.service'
import { UsersService } from '../../../users/users.service'
import { isValidAddress } from '../../../utils/address/address.validator'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'
import { SignMessageService } from '../signMessage/sign-message.service'
import { StartSignMessageRequestDto } from '../signMessage/start-sign-message-request.dto'
import { StartSignMessageResponseDto } from '../signMessage/start-sign-message-response.dto'

@Injectable()
export class Web3SignInService {
    constructor(
        private readonly userService: UsersService,
        private readonly web3AddressesService: Web3AddressesService,
        private readonly superTokensService: SuperTokensService,
        private readonly signMessageService: SignMessageService,
    ) {}

    private readonly cacheKey = 'SignInMessage'

    async start(dto: StartSignMessageRequestDto): Promise<StartSignMessageResponseDto> {
        return this.signMessageService.start(dto, this.cacheKey)
    }

    async confirm(dto: ConfirmSignMessageRequestDto, res?: Response): Promise<void> {
        await this.signMessageService.confirm(dto, this.cacheKey)
        await this.onMessageConfirmed(dto, res)
    }

    private async onMessageConfirmed(dto: ConfirmSignMessageRequestDto, res?: Response): Promise<void> {
        /**
         * Validation can return response to the user that can inform if there is any user associated
         * with the requested address. We validate it only if user signs the message successfully, because
         * then we are sure that this user owns the address and can obtain information regarding associated account.
         */
        await this.validateAddress(dto.address)
        const user = await this.userService.findOneByWeb3Address(dto.address)
        if (res) {
            try {
                await this.superTokensService.createSession(res, user.authId)
            } catch (error) {
                throw new InternalServerErrorException(error.status || HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            }
        }
    }

    private async validateAddress(address: string) {
        const isValid = isValidAddress(address)
        if (!isValid) {
            throw new BadRequestException('Incorrect address')
        }
        const doesAddressExist = await this.web3AddressesService.doesAddressExist(address)
        if (!doesAddressExist) {
            throw new NotFoundException('There is no user associated with this address')
        }
    }
}
