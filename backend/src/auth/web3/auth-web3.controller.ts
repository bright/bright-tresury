import {Body, Controller, HttpStatus, Post, Res} from "@nestjs/common";
import {ApiBadRequestResponse, ApiConflictResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
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
    @ApiOkResponse({
        description: 'Signup successfully started',
        type: [StartBlockchainSignUpResponse]
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid'
    })
    @ApiConflictResponse({
        description: 'Requested address already exists'
    })
    async startSignUp(@Body() startRequest: StartWeb3SignUpRequest): Promise<StartBlockchainSignUpResponse> {
        return this.authWeb3Service.startSignUp(startRequest)
    }

    @Post('/signup/confirm')
    @ApiOkResponse({
        description: 'Signup successfully confirmed',
        type: [StartBlockchainSignUpResponse]
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid'
    })
    @ApiConflictResponse({
        description: 'Requested address already exists'
    })
    @ApiBadRequestResponse({
        description: 'Requested signature is not valid'
    })
    async confirmSignUp(
        @Body() confirmRequest: ConfirmWeb3SignUpRequest,
        @Res() res: Response
    ) {
        await this.authWeb3Service.confirmSignUp(confirmRequest, res)
        res.status(HttpStatus.OK).send()
    }
}
