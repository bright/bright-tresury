import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiBadRequestResponse, ApiConflictResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthWeb3Service } from './auth-web3.service'
import { StartWeb3SignUpRequestDto, StartWeb3SignUpResponseDto } from './dto/start-web3-sign-up.dto'
import { ConfirmWeb3SignUpRequestDto } from './dto/confirm-web3-sign-up-request.dto'
import { Response } from 'express'

@Controller('/v1/auth/web3')
@ApiTags('auth.web3')
export class AuthWeb3Controller {
    constructor(private readonly authWeb3Service: AuthWeb3Service) {}

    @Post('/signin/start')
    @ApiOkResponse({
        description: 'Sign in successfully started',
        type: [StartWeb3SignResponse]
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid'
    })
    @ApiNotFoundResponse({
        description: 'Requested address does not belong to any existing user'
    })
    async startSignIn(@Body() startRequest: StartWeb3SignRequest): Promise<StartWeb3SignResponse> {
        return this.authWeb3Service.startSignIn(startRequest)
    }

    @Post('/signin/confirm')
    @ApiOkResponse({
        description: 'Sign in successfully confirmed',
        type: [StartWeb3SignResponse]
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid'
    })
    @ApiNotFoundResponse({
        description: 'Requested address does not belong to any existing user'
    })
    @ApiBadRequestResponse({
        description: 'Requested signature is not valid'
    })
    async confirmSignIn(
        @Body() confirmRequest: ConfirmWeb3SignRequest,
        @Res() res: Response
    ) {
        await this.authWeb3Service.confirmSignIn(confirmRequest, res)
        res.status(HttpStatus.OK).send()
    }

    @Post('/signup/start')
    @ApiOkResponse({
        description: 'Sign up successfully started',
        type: [StartWeb3SignUpResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid',
    })
    @ApiConflictResponse({
        description: 'Requested address already exists',
    })
    async startSignUp(@Body() startRequest: StartWeb3SignUpRequestDto): Promise<StartWeb3SignUpResponseDto> {
        return this.authWeb3Service.startSignUp(startRequest)
    }

    @Post('/signup/confirm')
    @ApiOkResponse({
        description: 'Signup successfully confirmed',
        type: [StartWeb3SignUpResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address or signature is not valid',
    })
    @ApiConflictResponse({
        description: 'Requested address already exists',
    })
    async confirmSignUp(@Body() confirmRequest: ConfirmWeb3SignUpRequestDto, @Res() res: Response) {
        await this.authWeb3Service.confirmSignUp(confirmRequest, res)
        res.status(HttpStatus.OK).send()
    }
}
