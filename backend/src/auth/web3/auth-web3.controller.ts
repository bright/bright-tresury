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

    @Post('/signup/start')
    @ApiOkResponse({
        description: 'Signup successfully started',
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
