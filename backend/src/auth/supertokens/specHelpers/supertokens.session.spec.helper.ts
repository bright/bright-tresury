import {INestApplication} from "@nestjs/common";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Request} from "express";
import supertest from "supertest";
import {User as SuperTokensUser} from "supertokens-node/lib/build/recipe/emailpassword/types";
import {v4 as uuid} from "uuid";
import {User} from "../../../users/user.entity"
import {request} from "../../../utils/spec.helpers";
import {BlockchainUserSignUpDto} from "../../blockchainUserSignUp.dto";
import {SessionUser} from "../../session/session.decorator";
import {SuperTokensService} from "../supertokens.service";

export class SessionHandler {
    readonly user: SessionUser
    private readonly cookies: string

    constructor(cookies: string, user: User) {
        this.cookies = cookies
        this.user = {user}
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
    let emailVerificationToken = ''
    jest.spyOn(app.get(SuperTokensService), 'sendVerifyEmail').mockImplementation(
        async (user1: SuperTokensUser, emailVerificationURLWithToken: string) => {
            const tokenQueryParam = 'token='
            const tokenStartIndex = emailVerificationURLWithToken.indexOf(tokenQueryParam) + tokenQueryParam.length
            emailVerificationToken = emailVerificationURLWithToken.substr(tokenStartIndex)
        })

    await sessionHandler.authorizeRequest(request(app)
        .post(`/api/v1/user/email/verify/token`))

    await request(app)
        .post(`/api/v1/user/email/verify`)
        .send({
            method: "token",
            token: emailVerificationToken
        })
}


export const createUserSessionHandler = async (
    app: INestApplication,
    email: string = 'chukc@example.com',
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
