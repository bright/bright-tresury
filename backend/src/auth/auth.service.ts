import {Injectable} from "@nestjs/common";
import {SuperTokensService} from "./supertokens/supertokens.service";
import {CreateBlockchainUserDto} from "./createBlockchainUser.dto";
import {User as SuperTokensUser} from "supertokens-node/lib/build/recipe/emailpassword/types";
import {UsersService} from "../users/users.service";
import {Request, Response} from 'express'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly superTokensService: SuperTokensService
    ) {
    }

    async blockchainSignUp(blockchainUserDto: CreateBlockchainUserDto) {
        const superTokensUser: SuperTokensUser = await this.superTokensService.signUp(blockchainUserDto.address, blockchainUserDto.token)
        const createUserDto = {
            authId: superTokensUser.id,
            email: blockchainUserDto.address,
            username: blockchainUserDto.username,
        }
        await this.userService.create(createUserDto)
    }

    async registerBlockchainToken(req: Request, res: Response, token: string) {
        await this.superTokensService.addSessionData(req, res, {blockchainToken: token})
    }
}
