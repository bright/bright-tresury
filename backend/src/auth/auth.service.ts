import {Injectable} from "@nestjs/common";
import {SuperTokensService} from "./supertokens/supertokens.service";
import {BlockchainUserSignUpDto} from "./blockchainUserSignUp.dto";
import {User as SuperTokensUser} from "supertokens-node/lib/build/recipe/emailpassword/types";
import {UsersService} from "../users/users.service";
import {Request, Response} from 'express'
import {CreateBlockchainUserDto} from "../users/dto/createBlockchainUser.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly superTokensService: SuperTokensService
    ) {
    }

    async blockchainSignUp(res: Response, blockchainUserDto: BlockchainUserSignUpDto) {
        const superTokensUser: SuperTokensUser = await this.superTokensService.signUp(blockchainUserDto.address, blockchainUserDto.token)
        const createUserDto = {
            authId: superTokensUser.id,
            username: blockchainUserDto.username,
            blockchainAddress: blockchainUserDto.address,
        } as CreateBlockchainUserDto
        await this.userService.createBlockchainUser(createUserDto)

        await this.superTokensService.createSession(res, superTokensUser.id)
    }

    async registerBlockchainToken(req: Request, res: Response, token: string) {
        await this.superTokensService.addSessionData(req, res, {blockchainToken: token})
    }
}
