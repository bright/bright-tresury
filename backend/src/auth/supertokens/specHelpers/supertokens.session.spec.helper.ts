import {Request} from "express";
import supertest from "supertest";
import {INestApplication} from "@nestjs/common";
import {BlockchainUserSignUpDto} from "../../blockchainUserSignUp.dto";
import {request} from "../../../utils/spec.helpers";

class SessionHandler {
    private cookies: string

    constructor(cookies: string) {
        this.cookies = cookies
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
    return createSessionHandler(res)
}

export const createUserSessionHandler = async (
    app: INestApplication,
    signUpSuperTokensUser: {
        formFields: Array<{
            id: string;
            value: any;
        }>
    }
): Promise<SessionHandler> => {
    const res: any = await request(app)
        .post(`/api/v1/signup`)
        .send(signUpSuperTokensUser)
    return createSessionHandler(res)
}

export const createSessionHandler = (res: any): SessionHandler => {
    const cookies = res.headers['set-cookie'].join('; ')
    return new SessionHandler(cookies)
}
