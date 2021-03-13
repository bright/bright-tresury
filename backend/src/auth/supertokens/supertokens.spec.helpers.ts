import {memoize} from "lodash";
import {Connection, getConnection} from "typeorm";
import {AuthorizationDatabaseName} from "../../database/authorization/authorization.database.module";
import {User} from "supertokens-node/lib/build/recipe/emailpassword/types";
import supertest from "supertest";
import {INestApplication} from "@nestjs/common";
import {request} from "../../utils/spec.helpers";
import {BlockchainUserSignUpDto} from "../blockchainUserSignUp.dto";
import {Request} from 'express';

// region database
const getAuthConnection = async (): Promise<Connection> => getConnection(AuthorizationDatabaseName)

const authorizationTablesToRemove = memoize(
    async (): Promise<Array<{ table_name: string }>> => {
        const connection = await getAuthConnection()
        return await connection.query(`
            select * from information_schema.tables where 
            table_schema='public' and table_name != 'key_value'
        `)
    }
)

export const getAuthUser = async (userId: string): Promise<User | undefined> => {
    const connection = await getAuthConnection()
    const plainUser = await connection.query(`
        SELECT * FROM emailpassword_users WHERE user_id = '${userId}'
    `)
    return plainUser.length > 0 ? {
        id: plainUser[0].user_id,
        email: plainUser[0].email,
        timeJoined: plainUser[0].time_joined,
    } as User : undefined
}

export const cleanAuthorizationDatabase = async () => {
    try {
        const tables = await authorizationTablesToRemove()
        const connection = await getAuthConnection()
        const tableList = tables.map((t: any) => `"${t.table_name}"`).join(', ')
        if (tableList) {
            const truncateQuery = `truncate ${tableList};`
            return await connection.query(truncateQuery)
        } else {
            // tslint:disable-next-line:no-console
            console.error(`Table list empty`)
        }
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error('Please make sure that beforeSetupFullApp is called before cleanDatabase.')
        // tslint:disable-next-line:no-console
        console.error(e)
    }
}
// endregion

// region session
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
        .post(`/api/signup`)
        .send(signUpSuperTokensUser)
    return createSessionHandler(res)
}

export const createSessionHandler = (res: any): SessionHandler => {
    const cookies = res.headers['set-cookie'].join('; ')
    return new SessionHandler(cookies)
}
// endregion
