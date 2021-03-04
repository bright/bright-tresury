import {ArgumentsHost, Catch, ExceptionFilter} from '@nestjs/common';
import supertokens, {Error as SuperTokensError} from 'supertokens-node';

@Catch(SuperTokensError)
export class SuperTokensExceptionFilter implements ExceptionFilter {
    errorHandlerMiddleware = supertokens.errorHandler();

    async catch(exception: any, host: ArgumentsHost): Promise<any> {
        const ctx = host.switchToHttp();
        await this.errorHandlerMiddleware(exception, ctx.getRequest(), ctx.getResponse(), (err: any) => {
            throw err;
        })
    }
}
