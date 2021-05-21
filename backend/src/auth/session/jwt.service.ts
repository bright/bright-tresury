import {
    BadRequestException,
    ConflictException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import {Request, Response} from 'express'
import {getUserByEmail, getUserById, signUp as superTokensSignUp} from "supertokens-node/lib/build/recipe/emailpassword";
import EmailPasswordSessionError from "supertokens-node/lib/build/recipe/emailpassword/error";
import {TypeFormField, User as SuperTokensUser} from "supertokens-node/lib/build/recipe/emailpassword/types";
import {
    createNewSession,
    getSession as superTokensGetSession,
    updateSessionData
} from "supertokens-node/lib/build/recipe/session";
import SessionError from "supertokens-node/lib/build/recipe/session/error";
import Session from "supertokens-node/lib/build/recipe/session/sessionClass";
import {EmailsService} from "../../emails/emails.service";
import {getLogger} from "../../logging.module";
import {CreateUserDto} from "../../users/dto/createUser.dto";
import {User} from "../../users/user.entity";
import {UsersService} from "../../users/users.service";
import {SessionData} from "../session/session.decorator";
// import {SessionExpiredHttpStatus, SuperTokensUsernameKey} from "./supertokens.recipeList";
import {isEmailVerified as superTokensIsEmailVerified} from "supertokens-node/lib/build/recipe/emailverification";

// const logger = getLogger()
//
// export interface JwtPayload {
//     id: string
//     username: string
//     email: string
//     isEmailVerified: boolean
//     isEmailPassword: boolean
//     isWeb3: boolean
//     web3Addresses: JwtWeb3Address[]
// }

// export interface JwtWeb3Address {
//     address: string
//     isPrimary: boolean
// }
//
@Injectable()
export class JwtService {
    constructor(
        private readonly usersService: UsersService,
    ) {
    }
//
//     getJwtPayload = async (email: string): Promise<JwtPayload | {}> => {
//         const authUser = await getUserByEmail(email)
//         if (authUser) {
//             return {}
//         }
//
//         const payload = {
//             email,
//             id: '',
//             username: '',
//             isEmailVerified: false,
//             isEmailPassword: false,
//             isWeb3: false,
//             web3Addresses: []
//         } as JwtPayload
//
//         try {
//             const user = await this.usersService.findOneByEmail(email)
//             payload.isEmailPassword = true
//             payload.id = user.id
//             payload.username = user.username
//             payload.isEmailVerified = await this.isEmailVerified(user)
//             if (user.blockchainAddresses?.length) {
//                 payload.isWeb3 = true
//                 payload.web3Addresses = user.blockchainAddresses.map(({address, isPrimary}) => {
//                     return {address, isPrimary}
//                 })
//             }
//         } catch (err) {
//             logger.error(err)
//         }
//         return payload
//     }
}
