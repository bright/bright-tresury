import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {Request, Response} from 'express'
import {getUserById, signUp as superTokensSignUp} from "supertokens-node/lib/build/recipe/emailpassword";
import EmailPasswordSessionError from "supertokens-node/lib/build/recipe/emailpassword/error";
import {TypeFormField, User as SuperTokensUser} from "supertokens-node/lib/build/recipe/emailpassword/types";
import {createNewSession, getSession as superTokensGetSession, updateJWTPayload, updateSessionData} from "supertokens-node/lib/build/recipe/session";
import SessionError from "supertokens-node/lib/build/recipe/session/error";
import Session from "supertokens-node/lib/build/recipe/session/sessionClass";
import {EmailsService} from "../../emails/emails.service";
import {getLogger} from "../../logging.module";
import {CreateUserDto} from "../../users/dto/createUser.dto";
import {User} from "../../users/user.entity";
import {UsersService} from "../../users/users.service";
import {SessionUser} from "../session/session.decorator";
import {SessionExpiredHttpStatus, SuperTokensUsernameKey} from "./supertokens.recipeList";
import {isEmailVerified as superTokensIsEmailVerified} from "supertokens-node/lib/build/recipe/emailverification";

export interface JWTPayload {
    id: string
    username: string
    email: string
    isEmailVerified: boolean
}

@Injectable()
export class SuperTokensService {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailsService: EmailsService,
    ) {
    }

    /** Returns undefined if valid and error message otherwise */
    getUsernameValidationError = async (value: string): Promise<string | undefined> => {
        const valid = await this.usersService.validateUsername(value)
        return valid ? undefined : "Username already taken"
    }

    handleCustomFormFieldsPostSignUp = async (user: SuperTokensUser, formFields: Array<{
        id: string;
        value: any;
    }>): Promise<void> => {
        const {id, email} = user
        const usernameFormField = formFields.find(({id: formFieldKey}) =>
            formFieldKey === SuperTokensUsernameKey
        )
        if (!usernameFormField) {
            throw new BadRequestException('Username was not found.')
        }
        const createUserDto = {
            authId: id,
            email,
            username: usernameFormField.value
        } as CreateUserDto
        await this.usersService.create(createUserDto)
    }

    handleResponseIfRefreshTokenError(res: Response, error: any) {
        if (error.type === SessionError.TRY_REFRESH_TOKEN) {
            res.status(SessionExpiredHttpStatus).send("Please refresh token.")
        }
    }

    async createSession(res: Response, userId: string): Promise<Session> {
        return await createNewSession(res, userId)
    }

    async getSession(req: Request, res: Response, doAntiCsrfCheck?: boolean): Promise<Session | undefined> {
        return await superTokensGetSession(req, res, doAntiCsrfCheck)
    }

    async isEmailVerified(user: User): Promise<boolean> {
        if (!user.email) {
            return false
        }
        try {
            return superTokensIsEmailVerified(user.authId, user.email)
        } catch (err) {
            getLogger().info(err)
        }
        return false
    }

    async signUp(email: string, password: string): Promise<SuperTokensUser> {
        try {
            return await superTokensSignUp(email, password)
        } catch (error) {
            const formattedError = error.type === EmailPasswordSessionError.EMAIL_ALREADY_EXISTS_ERROR ?
                new ConflictException(error.message) : error
            throw formattedError
        }
    }

    async addSessionData(req: Request, res: Response, data: Partial<SessionUser>) {
        const session = await this.getSession(req, res, false)
        if (session) {
            const currentSessionData = await session.getSessionData()
            await updateSessionData(
                session.getHandle(),
                {
                    ...currentSessionData,
                    ...data
                }
            )
        }
    }

    sendVerifyEmail = async (user: SuperTokensUser, emailVerificationURLWithToken: string): Promise<void> => {
        await this.emailsService.sendVerifyEmail(user.email, emailVerificationURLWithToken)
    }

    getEmailOrIdForUserId = async (userId: string): Promise<string> => {
        const user = await getUserById(userId)
        return user?.email ?? userId
    }

    setJwtPayload = async (superTokensUser: SuperTokensUser, formFields: TypeFormField[], action: "signin" | "signup"): Promise<JWTPayload> => {
        const payload = {
            email: superTokensUser.email,
            id: '',
            username: '',
            isEmailVerified: false
        }
        try {
            const user = await this.usersService.findOneByEmail(superTokensUser.email)
            payload.id = user.id
            payload.username = user.username
            payload.isEmailVerified = await this.isEmailVerified(user)
        } catch (err) {
            getLogger().error(err)
        }
        return payload
    }
}
