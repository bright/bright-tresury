import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiBadRequestResponse, ApiConflictResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Web3SignUpService } from './web3-sign-up.service'
import { ConfirmWeb3SignUpRequestDto } from './dto/confirm-web3-sign-up-request.dto'
import { StartSignMessageRequestDto } from '../signMessage/start-sign-message-request.dto'
import { StartSignMessageResponseDto } from '../signMessage/start-sign-message-response.dto'

@Controller('/v1/auth/web3/signup')
@ApiTags('auth.web3.signUp')
export class Web3SignUpController {
    constructor(private readonly web3SignUpService: Web3SignUpService) {}

    @Post('/start')
    @ApiOkResponse({
        description: 'Sign up successfully started',
        type: [StartSignMessageResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid',
    })
    @ApiConflictResponse({
        description: 'Requested address already exists',
    })
    async startSignUp(@Body() startRequest: StartSignMessageRequestDto): Promise<StartSignMessageResponseDto> {
        return this.web3SignUpService.startSignMessage(startRequest)
    }

    @Post('/confirm')
    @ApiOkResponse({
        description: 'Signup successfully confirmed',
    })
    @ApiBadRequestResponse({
        description: 'Requested address or signature is not valid',
    })
    @ApiConflictResponse({
        description: 'Requested address already exists',
    })
    async confirmSignUp(@Body() confirmRequest: ConfirmWeb3SignUpRequestDto, @Res() res: Response) {
        await this.web3SignUpService.confirmSignMessage(confirmRequest, res)
        res.status(HttpStatus.OK).send()
    }
}
