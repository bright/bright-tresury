import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
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
import Session from 'supertokens-node/recipe/session'
import { getConnection } from 'typeorm'
import { AuthorizationDatabaseName } from '../../database/authorization/authorization.database.module'
import { EmailsService } from '../../emails/emails.service'
import { getLogger } from '../../logging.module'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { UserStatus } from '../../users/entities/user-status'
import { UserEntity } from '../../users/entities/user.entity'
import { UsersService } from '../../users/users.service'
import { SessionData } from '../session/session.decorator'
import { SessionExpiredHttpStatus, SuperTokensUsernameKey } from './supertokens.recipeList'
import { AccountTemporaryLockedError } from './account-temporary-locked.error'
import { deleteUser as supertokensDeleteUser } from 'supertokens-node'

const logger = getLogger()

export interface AccessTokenPayload {
    id: string
    username: string
    email: string
    isEmailVerified: boolean
    web3Addresses: Web3Address[]
    status: UserStatus
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
            logger.info('Handle response if refresh token error')
            res.status(SessionExpiredHttpStatus)
        }
    }

    async createSession(res: Response, authId: string): Promise<SessionContainer> {
        const session = await createNewSession(res, authId)
        await this.refreshAccessTokenPayloadForSession(session)
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

    async refreshAccessTokenPayloadForUser(authId: string) {
        logger.info('Refreshing access token payload for authId ', authId)
        try {
            const sessionHandles = await Session.getAllSessionHandlesForUser(authId)
            const payload = await this.getAccessTokenPayload(authId)

            for (const handle of sessionHandles) {
                logger.info('Refreshing access token payload for session: ', handle)
                await Session.updateAccessTokenPayload(handle, payload)
            }
            logger.info('Access token payload refreshed')
        } catch (e) {
            logger.error('Error when updating access token payload', e)
        }
    }

    async refreshAccessTokenPayloadForSession(session: SessionContainerInterface) {
        logger.info('Refreshing access token payload for session...')
        const payload = await this.getAccessTokenPayload(session.getUserId())
        await session.updateAccessTokenPayload(payload)
        logger.info('Access token payload refreshed.')
    }

    async getAccessTokenPayload(authId: string): Promise<AccessTokenPayload> {
        const payload = {
            email: '',
            id: authId,
            username: '',
            isEmailVerified: false,
        } as AccessTokenPayload

        try {
            const user = await this.usersService.findOneByAuthId(authId)
            payload.id = user.id
            if (user.status === UserStatus.EmailPasswordEnabled) {
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
            payload.status = user.status
        } catch (err) {
            logger.error(err)
        }
        return payload
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

    sendResetPasswordEmail = async (user: SuperTokensUser, passwordResetURLWithToken: string): Promise<void> => {
        await this.emailsService.sendResetPasswordEmail(user.email, passwordResetURLWithToken)
    }

    async verifyEmail(authId: string) {
        const token = await createEmailVerificationToken(authId)
        if (token.status === 'OK') {
            return verifyEmailUsingToken(token.token)
        }
    }

    async verifyEmailByToken(token: string) {
        const result = await verifyEmailUsingToken(token)
        logger.info('Email verification finished with result: ', result)

        /* Result is either the User object (if email  successfully verified)
         * or an object with status describing the error */
        if (result && 'status' in result && result.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
            logger.error('Verify verification invalid token')
            throw new BadRequestException(result.status)
        } else if (result && 'id' in result) {
            await this.refreshAccessTokenPayloadForUser(result.id)
        }
    }

    async throwIfIsLockedOut(email: string) {
        if (await this.usersService.isLockedOut(email)) {
            throw new AccountTemporaryLockedError()
        }
    }
    async clearSignInAttemptCount(email: string) {
        return this.usersService.clearSignInAttemptCount(email)
    }

    async updateSignInAttemptCount(email: string) {
        return this.usersService.updateSignInAttemptCount(email)
    }

    async deleteUser(user: UserEntity): Promise<void> {
        await this.usersService.delete(user.id)
        const sessionHandles = await Session.getAllSessionHandlesForUser(user.authId)
        for (const handle of sessionHandles) {
            await Session.revokeSession(handle)
        }
        await supertokensDeleteUser(user.authId)
    }
}
