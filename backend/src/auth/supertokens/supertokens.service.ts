import {
    BadRequestException,
    ConflictException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { getUserById, signUp as superTokensSignUp } from 'supertokens-node/lib/build/recipe/emailpassword'
import EmailPasswordSessionError from 'supertokens-node/lib/build/recipe/emailpassword/error'
import { TypeFormField, User as SuperTokensUser } from 'supertokens-node/lib/build/recipe/emailpassword/types'
import {
    createNewSession,
    getSession as superTokensGetSession,
    updateSessionData,
} from 'supertokens-node/lib/build/recipe/session'
import SessionError from 'supertokens-node/lib/build/recipe/session/error'
import Session from 'supertokens-node/lib/build/recipe/session/sessionClass'
import { EmailsService } from '../../emails/emails.service'
import { getLogger } from '../../logging.module'
import { CreateUserDto } from '../../users/dto/createUser.dto'
import { User } from '../../users/user.entity'
import { UsersService } from '../../users/users.service'
import { SessionData } from '../session/session.decorator'
import { SessionExpiredHttpStatus, SuperTokensUsernameKey } from './supertokens.recipeList'
import {
    createEmailVerificationToken,
    isEmailVerified as superTokensIsEmailVerified,
    verifyEmailUsingToken,
} from 'supertokens-node/lib/build/recipe/emailverification'

const logger = getLogger()

export interface JWTPayload {
    id: string
    username: string
    email: string
    isEmailVerified: boolean
    web3Addresses: Web3Address[]
}

interface Web3Address {
    address: string
    isPrimary: boolean
}

@Injectable()
export class SuperTokensService {
    constructor(private readonly usersService: UsersService, private readonly emailsService: EmailsService) {}

    /** Returns undefined if valid and error message otherwise */
    getUsernameValidationError = async (value: string): Promise<string | undefined> => {
        try {
            await this.usersService.validateUsername(value)
            return undefined
        } catch {
            return 'Username already taken'
        }
    }

    handleCustomFormFieldsPostSignUp = async (
        user: SuperTokensUser,
        formFields: Array<{
            id: string
            value: any
        }>,
    ): Promise<void> => {
        const { id, email } = user
        const usernameFormField = formFields.find(({ id: formFieldKey }) => formFieldKey === SuperTokensUsernameKey)
        if (!usernameFormField) {
            throw new BadRequestException('Username was not found.')
        }
        const createUserDto = {
            authId: id,
            email,
            username: usernameFormField.value,
        } as CreateUserDto
        await this.usersService.create(createUserDto)
    }

    handleResponseIfRefreshTokenError(res: Response, error: any) {
        if (error.type === SessionError.TRY_REFRESH_TOKEN) {
            res.status(SessionExpiredHttpStatus).send('Please refresh token.')
        }
    }

    async createSession(res: Response, authId: string): Promise<Session> {
        const session = await createNewSession(res, authId)
        await this.refreshJwtPayloadBySession(session)
        return session
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
            logger.info(err)
        }
        return false
    }

    async signUp(email: string, password: string): Promise<SuperTokensUser> {
        try {
            return await superTokensSignUp(email, password)
        } catch (error) {
            throw error.type === EmailPasswordSessionError.EMAIL_ALREADY_EXISTS_ERROR
                ? new ConflictException(error.message)
                : new InternalServerErrorException(error.status || HttpStatus.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async addSessionData(req: Request, res: Response, data: Partial<SessionData>) {
        const session = await this.getSession(req, res, false)
        if (session) {
            const currentSessionData = await session.getSessionData()
            await updateSessionData(session.getHandle(), {
                ...currentSessionData,
                ...data,
            })
        }
    }

    async refreshJwtPayload(req: Request, res: Response) {
        const session = await this.getSession(req, res, false)
        if (session) {
            await this.refreshJwtPayloadBySession(session)
        }
    }

    async refreshJwtPayloadBySession(session: Session) {
        const jwtPayload = await this.getJwtPayload(session.getUserId())
        await session?.updateJWTPayload({ ...jwtPayload })
    }

    sendVerifyEmail = async (user: SuperTokensUser, emailVerificationURLWithToken: string): Promise<void> => {
        await this.emailsService.sendVerifyEmail(user.email, emailVerificationURLWithToken)
    }

    getEmailForUserId = async (userId: string): Promise<string> => {
        const user = await getUserById(userId)
        if (!user) {
            /*
            Supertokens documentation does not clearly specify what this function should return if no user found for e given user id
            Supertokens sometimes hide the errors thrown, so we log the behaviour explicitly.
             */
            logger.error('No user found for the given user id in getEmailForUserId function')
            throw new NotFoundException('No user found for the giver user id')
        }
        return user.email
    }

    setJwtPayload = async (
        superTokensUser: SuperTokensUser,
        formFields: TypeFormField[],
        action: 'signin' | 'signup',
    ): Promise<JWTPayload> => this.getJwtPayload(superTokensUser.id)

    private async getJwtPayload(authId: string): Promise<JWTPayload> {
        const payload = {
            email: '',
            id: authId,
            username: '',
            isEmailVerified: false,
        } as JWTPayload
        try {
            const user = await this.usersService.findOneByAuthId(authId)
            payload.id = user.id
            payload.username = user.username
            payload.isEmailVerified = await this.isEmailVerified(user)
            payload.web3Addresses = user.blockchainAddresses
                ? user.blockchainAddresses.map((bAddress) => {
                      return {
                          address: bAddress.address,
                          isPrimary: bAddress.isPrimary,
                      } as Web3Address
                  })
                : []
        } catch (err) {
            logger.error(err)
        }
        return payload
    }

    async verifyEmail(authId: string, email: string) {
        const token = await createEmailVerificationToken(authId, email)
        await verifyEmailUsingToken(token)
    }
}
