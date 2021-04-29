import {INestApplication} from "@nestjs/common";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Request} from "express";
import supertest from "supertest";
import {createEmailVerificationToken, verifyEmailUsingToken} from "supertokens-node/lib/build/recipe/emailverification";
import {v4 as uuid} from "uuid";
import {User} from "../../../users/user.entity"
import {request} from "../../../utils/spec.helpers";
import {BlockchainUserSignUpDto} from "../../blockchainUserSignUp.dto";
import {SessionData} from "../../session/session.decorator";

export class SessionHandler {

    readonly sessionData: SessionData

    private readonly cookies: string

    constructor(cookies: string, user: User) {
        this.cookies = cookies
        this.sessionData = {user}
    }

    getAuthorizedRequest(): Request {
        return {
            headers: {
                cookie: this.cookies
            }
        } as Request
    }

    authorizeRequest(req: supertest.Test): supertest.Test {
        return this.cookies ? req.set('cookie', this.cookies) : req
    }
}

export const createBlockchainSessionHandler = async (
    app: INestApplication,
    blockchainUserSignUpDto: BlockchainUserSignUpDto
): Promise<SessionHandler> => {
    const res: any = await request(app)
        .post(`/api/v1/auth/blockchain/signup`)
        .send(blockchainUserSignUpDto)
    const user = await app.get(getRepositoryToken(User)).findOne({blockchainAddress: blockchainUserSignUpDto.address})
    return createSessionHandler(res, user)
}

export const createUserSessionHandlerWithVerifiedEmail = async (
    app: INestApplication,
    email?: string,
    username?: string,
    password?: string
): Promise<SessionHandler> => {
    const sessionHandler = await createUserSessionHandler(app, email, username, password)
    await verifyEmail(app, sessionHandler)
    return sessionHandler
}

export const verifyEmail = async (app: INestApplication, sessionHandler: SessionHandler) => {
    const token = await createEmailVerificationToken(sessionHandler.sessionData.user.authId, sessionHandler.sessionData.user.email!)
    await verifyEmailUsingToken(token)
}

export const createUserSessionHandler = async (
    app: INestApplication,
    email: string = 'chuck@example.com',
    username: string = 'chuck',
    password: string = uuid()
): Promise<SessionHandler> => {
    const signupData = {
        formFields: [
            {id: 'email', value: email},
            {id: 'username', value: username},
            {id: 'password', value: password},
        ]
    }
    const res: any = await request(app)
        .post(`/api/v1/signup`)
        .send(signupData)
    const user = await app.get(getRepositoryToken(User)).findOne({email})
    return createSessionHandler(res, user)
}

export const createSessionHandler = (res: any, user: User): SessionHandler => {
    const cookies = res.headers['set-cookie'].join('; ')
    return new SessionHandler(cookies, user)
}
