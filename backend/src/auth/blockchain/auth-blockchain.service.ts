import {BadRequestException, ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {User as SuperTokensUser} from "supertokens-node/lib/build/recipe/emailpassword/types";
import {Response} from 'express'
import {UsersService} from "../../users/users.service";
import {SuperTokensService} from "../supertokens/supertokens.service";
import {CreateBlockchainUserDto} from "../../users/dto/createBlockchainUser.dto";
import {StartBlockchainSignUpRequest, StartBlockchainSignUpResponse} from "./dto/start-blockchain-sign-up.request";
import {ConfirmBlockchainSignUpRequest} from "./dto/confirm-blockchain-sign-up.request";
import {v4 as uuid} from 'uuid';
import {CacheManager} from "../../cache/cache.manager";
import {decodeAddress, signatureVerify} from '@polkadot/util-crypto';
import {u8aToHex} from '@polkadot/util';

@Injectable()
export class AuthBlockchainService {

    /**
     * Sign up message expiration time
     */
    private SignMessageTtlMs = 5 * 60

    constructor(
        private readonly userService: UsersService,
        private readonly superTokensService: SuperTokensService,
        private readonly cacheManager: CacheManager
    ) {
    }

    async startSignUp(startDto: StartBlockchainSignUpRequest): Promise<StartBlockchainSignUpResponse> {
        await this.validateIfUserAlreadyExist(startDto.address)

        const signMessage = uuid()
        const signMessageKey = this.getSignMessageCacheKey(startDto.address)
        await this.cacheManager.set<string>(signMessageKey, signMessage, {ttl: this.SignMessageTtlMs})

        return {signMessage} as StartBlockchainSignUpResponse
    }

    async confirmSignUp(confirmRequest: ConfirmBlockchainSignUpRequest, res: Response): Promise<void> {
        await this.validateIfUserAlreadyExist(confirmRequest.address)

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

    private async validateIfUserAlreadyExist(address: string) {
        const isValid = await this.userService.validateBlockchainAddress(address)
        if (!isValid) {
            throw new ConflictException('User with this address already exists')
        }
    }

    private async createBlockchainUser(address: string, res: Response) {
        const username = uuid();
        const password = uuid();

        try {
            // tslint:disable-next-line:no-console
            console.error('Creating Supertokens user')
            const superTokensUser: SuperTokensUser = await this.superTokensService.signUp(address, password)
            const createUserDto = {
                authId: superTokensUser.id,
                username,
                blockchainAddress: address,
            } as CreateBlockchainUserDto
            // tslint:disable-next-line:no-console
            console.error('Creating Blockchain user')
            await this.userService.createBlockchainUser(createUserDto)

            // tslint:disable-next-line:no-console
            console.error('Creating session')
            await this.superTokensService.createSession(res, superTokensUser.id)
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error('Supertokens failure', e)
        }
    }

    private getSignMessageCacheKey = (address: string) => `SignMessage:${address}`

    private validateSignature = (signMessage: string, confirmRequest: ConfirmBlockchainSignUpRequest): boolean => {
        const publicAddressKey = decodeAddress(confirmRequest.address);
        const publicHexAddressKey = u8aToHex(publicAddressKey);

        const result = signatureVerify(signMessage, confirmRequest.signature, publicHexAddressKey)
        return result.isValid
    }

}
