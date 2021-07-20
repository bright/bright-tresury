import { Body, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiBadRequestResponse, ApiConflictResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ControllerApiVersion } from '../../../utils/ControllerApiVersion'
import { ConfirmSignMessageRequestDto } from '../signMessage/confirm-sign-message-request.dto'
import { Web3SignUpService } from './web3-sign-up.service'
import { StartSignMessageRequestDto } from '../signMessage/start-sign-message-request.dto'
import { StartSignMessageResponseDto } from '../signMessage/start-sign-message-response.dto'

@ControllerApiVersion('/auth/web3/signup', ['v1'])
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
        return this.web3SignUpService.start(startRequest)
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
    async confirmSignUp(@Body() confirmRequest: ConfirmSignMessageRequestDto, @Res() res: Response) {
        await this.web3SignUpService.confirm(confirmRequest, res)
        res.status(HttpStatus.OK).send()
    }
}
