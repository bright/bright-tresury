import {
    BadRequestException,
    ConflictException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { Response } from 'express'
import { User as SuperTokensUser } from 'supertokens-node/lib/build/recipe/emailpassword/types'
import { v4 as uuid } from 'uuid'
import { BlockchainAddressesService } from '../../../users/blockchainAddresses/blockchainAddresses.service'
import { CreateBlockchainUserDto } from '../../../users/dto/create-blockchain-user.dto'
import { UsersService } from '../../../users/users.service'
import { isValidAddress } from '../../../utils/address/address.validator'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { SignMessageService } from '../signMessage/sign-message.service'
import { StartSignMessageRequestDto } from '../signMessage/start-sign-message-request.dto'
import { StartSignMessageResponseDto } from '../signMessage/start-sign-message-response.dto'
import { ConfirmWeb3SignUpRequestDto } from './dto/confirm-web3-sign-up-request.dto'

@Injectable()
export class Web3SignUpService {
    constructor(
        private readonly userService: UsersService,
        private readonly blockchainAddressService: BlockchainAddressesService,
        private readonly superTokensService: SuperTokensService,
        private readonly signMessageService: SignMessageService,
    ) {}

    private readonly cacheKey = 'SignUpMessage'

    async start(dto: StartSignMessageRequestDto): Promise<StartSignMessageResponseDto> {
        await this.validateAddress(dto.address)
        return this.signMessageService.start(dto, this.cacheKey)
    }

    async confirm(dto: ConfirmWeb3SignUpRequestDto, res: Response): Promise<void> {
        await this.validateAddress(dto.address)
        await this.signMessageService.confirm(dto, this.cacheKey)
        await this.createBlockchainUser(dto.address, res)
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
        const user = await this.userService.createBlockchainUser(createUserDto)
        try {
            await this.superTokensService.verifyEmail(user.authId, superTokensUser.email)
            await this.superTokensService.createSession(res, superTokensUser.id)
        } catch (error) {
            throw new InternalServerErrorException(error.status || HttpStatus.INTERNAL_SERVER_ERROR, error.message)
        }
    }
}
