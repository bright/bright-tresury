import { Body, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ControllerApiVersion } from '../../../utils/ControllerApiVersion'
import { Web3SignInService } from './web3-sign-in.service'
import { ConfirmSignMessageRequestDto } from '../signMessage/dto/confirm-sign-message-request.dto'
import { StartSignMessageResponseDto } from '../signMessage/dto/start-sign-message-response.dto'
import { StartSignMessageRequestDto } from '../signMessage/dto/start-sign-message-request.dto'

@ControllerApiVersion('/auth/web3/signin', ['v1'])
@ApiTags('auth.web3.signIn')
export class Web3SignInController {
    constructor(private readonly web3SignInService: Web3SignInService) {}

    @Post('/start')
    @ApiOkResponse({
        description: 'Sign in successfully started',
        type: [StartSignMessageResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid',
    })
    @ApiNotFoundResponse({
        description: 'Requested address does not belong to any existing user',
    })
    async startSignIn(@Body() startRequest: StartSignMessageRequestDto): Promise<StartSignMessageResponseDto> {
        return this.web3SignInService.start(startRequest)
    }

    @Post('/confirm')
    @ApiOkResponse({
        description: 'Sign in successfully confirmed',
    })
    @ApiBadRequestResponse({
        description: 'Requested address or signature is invalid or requested address did not start sign in before',
    })
    @ApiNotFoundResponse({
        description: 'Requested address does not belong to any existing user',
    })
    async confirmSignIn(@Body() confirmRequest: ConfirmSignMessageRequestDto, @Res() res: Response) {
        await this.web3SignInService.confirm(confirmRequest, res)
        res.status(HttpStatus.OK).send()
    }
}
