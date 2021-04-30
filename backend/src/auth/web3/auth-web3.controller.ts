import {Body, Controller, HttpStatus, Post, Res} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {AuthWeb3Service} from "./auth-web3.service";
import {StartBlockchainSignUpResponse, StartWeb3SignUpRequest} from "./dto/start-web3-sign-up.request";
import {ConfirmWeb3SignUpRequest} from "./dto/confirm-web3-sign-up.request";
import {Response} from 'express';

@Controller('/v1/auth/web3')
@ApiTags('auth.web3')
export class AuthWeb3Controller {

    constructor(
        private readonly authWeb3Service: AuthWeb3Service
    ) {
    }

    @Post('/signup/start')
    async startSignUp(@Body() startRequest: StartWeb3SignUpRequest): Promise<StartBlockchainSignUpResponse> {
        return this.authWeb3Service.startSignUp(startRequest)
    }

    @Post('/signup/confirm')
    async confirmSignUp(
        @Body() confirmRequest: ConfirmWeb3SignUpRequest,
        @Res() res: Response
    ) {
        try {
            await this.authWeb3Service.confirmSignUp(confirmRequest, res)
            res.status(HttpStatus.OK).send()
        } catch (e) {
            res.status(e.status ? e.status : HttpStatus.INTERNAL_SERVER_ERROR).send(e)
        }
    }
}
