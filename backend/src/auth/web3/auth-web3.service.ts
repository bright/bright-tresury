import {BadRequestException, ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {User as SuperTokensUser} from "supertokens-node/lib/build/recipe/emailpassword/types";
import {Response} from 'express'
import {UsersService} from "../../users/users.service";
import {SuperTokensService} from "../supertokens/supertokens.service";
import {CreateBlockchainUserDto} from "../../users/dto/createBlockchainUser.dto";
import {StartBlockchainSignUpResponse, StartWeb3SignUpRequest} from "./dto/start-web3-sign-up.request";
import {ConfirmWeb3SignUpRequest} from "./dto/confirm-web3-sign-up.request";
import {v4 as uuid} from 'uuid';
import {CacheManager} from "../../cache/cache.manager";
import {decodeAddress, signatureVerify} from '@polkadot/util-crypto';
import {u8aToHex} from '@polkadot/util';
import {BlockchainAddressService} from "../../users/blockchainAddress/blockchainAddress.service";
import {isValidAddress} from "../../utils/address/address.validator";

@Injectable()
export class AuthWeb3Service {

    /**
     * Sign up message expiration time in seconds
     */
    private readonly SignMessageTtlInSeconds = 5 * 60

    constructor(
        private readonly userService: UsersService,
        private readonly blockchainAddressService: BlockchainAddressService,
        private readonly superTokensService: SuperTokensService,
        private readonly cacheManager: CacheManager
    ) {
    }

    async startSignUp(startDto: StartWeb3SignUpRequest): Promise<StartBlockchainSignUpResponse> {
        await this.validateAddress(startDto.address)

        const signMessage = uuid()
        const signMessageKey = this.getSignMessageCacheKey(startDto.address)
        await this.cacheManager.set<string>(signMessageKey, signMessage, {ttl: this.SignMessageTtlInSeconds})

        return new StartBlockchainSignUpResponse(signMessage)
    }

    async confirmSignUp(confirmRequest: ConfirmWeb3SignUpRequest, res: Response): Promise<void> {
        await this.validateAddress(confirmRequest.address)

        const signMessageKey = this.getSignMessageCacheKey(confirmRequest.address)
        const cachedSignMessage = await this.cacheManager.get<string>(signMessageKey)
        if (!cachedSignMessage) {
            throw new NotFoundException('Sign message was not found')
        }

        const signatureValid = this.validateSignature(cachedSignMessage, confirmRequest)
        if (signatureValid) {
            await this.createBlockchainUser(confirmRequest.address, res)
        } else {
            throw new BadRequestException('The signature is invalid')
        }
    }

    validateSignature = (signMessage: string, confirmRequest: ConfirmWeb3SignUpRequest): boolean => {
        const publicAddressKey = decodeAddress(confirmRequest.address);
        const publicHexAddressKey = u8aToHex(publicAddressKey);

        const result = signatureVerify(signMessage, confirmRequest.signature, publicHexAddressKey)
        return result.isValid
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
        const userUuid = uuid();
        const password = uuid();

        const superTokensUser: SuperTokensUser = await this.superTokensService.signUp(userUuid, password)
        const createUserDto = {
            authId: superTokensUser.id,
            username: userUuid,
            blockchainAddress: address,
        } as CreateBlockchainUserDto
        await this.userService.createBlockchainUser(createUserDto)
        await this.superTokensService.createSession(res, superTokensUser.id)
    }

    private getSignMessageCacheKey = (address: string) => `SignMessage:${address}`

}
