import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

import { errorHandler } from 'supertokens-node/framework/express'
import { Error as STError } from 'supertokens-node'
import { ACCOUNT_TEMPORARY_LOCKED } from './supertokens/account-temporary-locked.error'


@Catch(STError)
export class SupertokensExceptionFilter implements ExceptionFilter {
    handler: ErrorRequestHandler

    constructor() {
        this.handler = errorHandler()
    }

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp()

        const resp = ctx.getResponse<Response>()
        if (resp.headersSent) {
            return
        }
        if (exception.message === ACCOUNT_TEMPORARY_LOCKED){
            return resp.status(HttpStatus.OK)
                .json({status: ACCOUNT_TEMPORARY_LOCKED})
        }

        this.handler(exception, ctx.getRequest<Request>(), resp, ctx.getNext<NextFunction>())
    }
}
