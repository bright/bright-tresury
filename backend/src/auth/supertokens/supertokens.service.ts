import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {UsersService} from "../../users/users.service";
import {User as SuperTokensUser} from "supertokens-node/lib/build/recipe/emailpassword/types";
import {CreateUserDto} from "../../users/dto/createUser.dto";
import {SessionExpiredHttpStatus, SuperTokensUsernameKey} from "./supertokens.recipeList";
import {signUp as superTokensSignUp} from "supertokens-node/lib/build/recipe/emailpassword";
import EmailPasswordSessionError from "supertokens-node/lib/build/recipe/emailpassword/error";
import {createNewSession, getSession as superTokensGetSession, updateSessionData} from "supertokens-node/lib/build/recipe/session";
import {Request, Response} from 'express'
import Session from "supertokens-node/lib/build/recipe/session/sessionClass";
import {SessionUser} from "../session/session.decorator";
import SessionError from "supertokens-node/lib/build/recipe/session/error";

@Injectable()
export class SuperTokensService {
    constructor(
        private readonly usersService: UsersService,
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

    async getSession(req: Request, res: Response, doAntiCsrfCheck?: boolean): Promise<Session> {
        return await superTokensGetSession(req, res, doAntiCsrfCheck)
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
