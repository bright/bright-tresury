import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import {
    createEmailVerificationToken,
    createResetPasswordToken,
    getUserByEmail,
    getUserById,
    isEmailVerified as superTokensIsEmailVerified,
    resetPasswordUsingToken,
    signIn,
    signUp as superTokensSignUp,
    verifyEmailUsingToken,
} from 'supertokens-node/lib/build/recipe/emailpassword'

import { User as SuperTokensUser } from 'supertokens-node/lib/build/recipe/emailpassword/types'
import {
    createNewSession,
    getSession as superTokensGetSession,
    updateSessionData,
} from 'supertokens-node/lib/build/recipe/session'
import SessionError from 'supertokens-node/lib/build/recipe/session/error'
import {
    SessionContainerInterface,
    SessionContainerInterface as SessionContainer,
    VerifySessionOptions,
} from 'supertokens-node/lib/build/recipe/session/types'
import { getConnection } from 'typeorm'
import { AuthorizationDatabaseName } from '../../database/authorization/authorization.database.module'
import { EmailsService } from '../../emails/emails.service'
import { getLogger } from '../../logging.module'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { UserEntity } from '../../users/user.entity'
import { UsersService } from '../../users/users.service'
import { SessionData } from '../session/session.decorator'
import { SessionExpiredHttpStatus, SuperTokensUsernameKey } from './supertokens.recipeList'

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
        formFields: {
            id: string
            value: any
        }[],
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

    async createSession(res: Response, authId: string): Promise<SessionContainer> {
        const session = await createNewSession(res, authId)
        await this.refreshJwtPayloadBySession(session)
        return session
    }

    async getSession(
        req: Request,
        res: Response,
        options?: VerifySessionOptions,
    ): Promise<SessionContainer | undefined> {
        return await superTokensGetSession(req, res, options)
    }

    async isEmailVerified(user: UserEntity): Promise<boolean> {
        if (!user.email) {
            return false
        }
        try {
            return superTokensIsEmailVerified(user.authId)
        } catch (err) {
            logger.error(err)
        }
        return false
    }

    async signUp(email: string, password: string): Promise<SuperTokensUser> {
        const result = await superTokensSignUp(email, password)
        if (result.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
            throw new ConflictException('EMAIL_ALREADY_EXISTS_ERROR')
        }
        return result.user
    }

    /*
    This method updates the email address in authorization database with raw sql query
    Supertokens lib does not provide a method to update the email address
    TODO: Implement the Web3 sign in and up with thirdpartyemailaddress recipe
     */
    async updateEmail(userId: string, email: string): Promise<void> {
        const user = await getUserById(userId)
        if (!user) {
            logger.error(`Cannot found user with id ${userId}. Email NOT changed to ${email}`)
            throw new NotFoundException()
        }

        const userWithEmail = await getUserByEmail(email)
        if (userWithEmail) {
            logger.error(`User with email ${email} already exists. User ${userId} NOT updated`)
            throw new ConflictException()
        }

        const connection = getConnection(AuthorizationDatabaseName)
        await connection.query(`UPDATE emailpassword_users SET email = '${email}' WHERE user_id = '${userId}'`)
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        const token = await createResetPasswordToken(userId)
        if (token.status === 'UNKNOWN_USER_ID_ERROR') {
            logger.error(`Cannot found user with id ${userId}. Password NOT updated`)
            throw new NotFoundException()
        }
        await resetPasswordUsingToken(token.token, password)
    }

    async refreshSessionData(session: SessionContainerInterface) {
        logger.info('Refreshing session data...')
        const user = await this.usersService.findOneByAuthId(session.getUserId())
        logger.info('Refreshing session data, new user:', user)
        if (!user) {
            await session.revokeSession()
        } else {
            await this.updateSessionData({ user }, session)
            logger.info('Session data refreshed.')
        }
    }

    async updateSessionData(data: Partial<SessionData>, session?: SessionContainerInterface) {
        if (session) {
            const currentSessionData = await session.getSessionData()
            await updateSessionData(session.getHandle(), {
                ...currentSessionData,
                ...data,
            })
        }
    }

    async getSessionData(userId: string) {
        const user = await this.usersService.findOneByAuthId(userId)
        return { user }
    }

    async refreshJwtPayload(req: Request, res: Response) {
        logger.info('Refreshing JWT payload and session data...')
        const session = await this.getSession(req, res, { antiCsrfCheck: false })
        logger.info('Refreshing JWT payload and session data, current session: ', session)
        if (session) {
            await this.refreshJwtPayloadBySession(session)
            await this.refreshSessionData(session)
        }
        logger.info('JWT payload and session data refreshed')
    }

    async refreshJwtPayloadBySession(session: SessionContainerInterface) {
        logger.info('Refreshing JWT payload by session data...')
        const jwtPayload = await this.getJwtPayload(session.getUserId())
        logger.info('Refreshing JWT payload by session data, new jwt payload:', jwtPayload)
        await session.updateAccessTokenPayload(jwtPayload)
        logger.info('JWT payload refreshed.')
    }

    async verifyPassword(email: string, password: string) {
        try {
            const result = await signIn(email, password)
            if (result.status !== 'OK') {
                throw new ForbiddenException('Incorrect password')
            }
        } catch (e) {
            throw new ForbiddenException('Incorrect password')
        }
    }

    sendVerifyEmail = async (user: SuperTokensUser, emailVerificationURLWithToken: string): Promise<void> => {
        await this.emailsService.sendVerifyEmail(user.email, emailVerificationURLWithToken)
    }

    async getJwtPayload(authId: string): Promise<JWTPayload> {
        const payload = {
            email: '',
            id: authId,
            username: '',
            isEmailVerified: false,
        } as JWTPayload

        try {
            const user = await this.usersService.findOneByAuthId(authId)
            payload.id = user.id
            if (user.isEmailPasswordEnabled) {
                payload.username = user.username
                payload.email = user.email
            }
            payload.isEmailVerified = await this.isEmailVerified(user)
            payload.web3Addresses = user.web3Addresses
                ? user.web3Addresses.map((web3Address) => {
                      return {
                          address: web3Address.address,
                          isPrimary: web3Address.isPrimary,
                      } as Web3Address
                  })
                : []
        } catch (err) {
            logger.error(err)
        }
        return payload
    }

    async verifyEmail(authId: string, email: string) {
        const token = await createEmailVerificationToken(authId)
        if (token.status === 'OK') {
            return verifyEmailUsingToken(token.token)
        }
    }

    async verifyEmailByToken(req: Request, res: Response, token: string) {
        try {
            const result = await verifyEmailUsingToken(token)

            if (result && 'status' in result && result.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
                res.status(HttpStatus.BAD_REQUEST).send(result.status)
                return
            }

            await this.refreshJwtPayload(req, res)
        } catch (e: any) {
            res.status(HttpStatus.BAD_REQUEST).send(e.message)
        }
    }
}
