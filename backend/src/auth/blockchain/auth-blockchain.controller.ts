import {Body, Controller, HttpStatus, Post, Res} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {AuthBlockchainService} from "./auth-blockchain.service";
import {StartBlockchainSignUpRequest, StartBlockchainSignUpResponse} from "./dto/start-blockchain-sign-up.request";
import {ConfirmBlockchainSignUpRequest} from "./dto/confirm-blockchain-sign-up.request";
import {Response} from 'express';

@Controller('/v1/auth/blockchain')
@ApiTags('auth.blockchain')
export class AuthBlockchainController {

    constructor(
        private readonly authBlockchainService: AuthBlockchainService
    ) {
    }

    @Post('signup/start')
    async startSignUp(@Body() startRequest: StartBlockchainSignUpRequest): Promise<StartBlockchainSignUpResponse> {
        return this.authBlockchainService.startSignUp(startRequest)
    }

    @Post('signup/confirm')
    async confirmSignUp(
        @Body() confirmRequest: ConfirmBlockchainSignUpRequest,
        @Res() res: Response
    ) {
        await this.authBlockchainService.confirmSignUp(confirmRequest, res)
        res.status(HttpStatus.OK).send()
    }
}
