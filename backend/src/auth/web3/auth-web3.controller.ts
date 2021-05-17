import { Body, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger'
import {ControllerApiVersion} from "../../utils/ControllerApiVersion";
import { AuthWeb3Service } from './auth-web3.service'
import { StartWeb3SignRequestDto, StartWeb3SignResponseDto } from './dto/start-web3-sign.dto'
import { ConfirmWeb3SignUpRequestDto } from './dto/confirm-web3-sign-up-request.dto'
import { Response } from 'express'
import { ConfirmSignMessageRequestDto } from './signingMessage/confirm-sign-message-request.dto'
import { ReqSession, SessionData } from '../session/session.decorator'
import { SessionGuard } from '../session/guard/session.guard'

@ControllerApiVersion('/auth/web3', ['v1'])
@ApiTags('auth.web3')
export class AuthWeb3Controller {
    constructor(private readonly authWeb3Service: AuthWeb3Service) {}

    @Post('/signin/start')
    @ApiOkResponse({
        description: 'Sign in successfully started',
        type: [StartWeb3SignResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid',
    })
    @ApiNotFoundResponse({
        description: 'Requested address does not belong to any existing user',
    })
    async startSignIn(@Body() startRequest: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
        return this.authWeb3Service.startSignIn(startRequest)
    }

    @Post('/signin/confirm')
    @ApiOkResponse({
        description: 'Sign in successfully confirmed',
        type: [StartWeb3SignResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address or signature is invalid or requested address did not start sign in before',
    })
    @ApiNotFoundResponse({
        description: 'Requested address does not belong to any existing user',
    })
    async confirmSignIn(@Body() confirmRequest: ConfirmSignMessageRequestDto, @Res() res: Response) {
        await this.authWeb3Service.confirmSignIn(confirmRequest, res)
        res.status(HttpStatus.OK).send()
    }

    @Post('/signup/start')
    @ApiOkResponse({
        description: 'Sign up successfully started',
        type: [StartWeb3SignResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid',
    })
    @ApiConflictResponse({
        description: 'Requested address already exists',
    })
    async startSignUp(@Body() startRequest: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
        return this.authWeb3Service.startSignUp(startRequest)
    }

    @Post('/signup/confirm')
    @ApiOkResponse({
        description: 'Signup successfully confirmed',
        type: [StartWeb3SignResponseDto],
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

    @Post('/associate/start')
    @ApiOkResponse({
        description: 'Association successfully started',
        type: [StartWeb3SignResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address is invalid',
    })
    @ApiConflictResponse({
        description: 'Requested address already exists',
    })
    async startAssociatingAddress(@Body() startRequest: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
        return this.authWeb3Service.startAssociatingAddress(startRequest)
    }

    @Post('/associate/confirm')
    @UseGuards(SessionGuard)
    @ApiOkResponse({
        description: 'Association successfully confirmed',
        type: [StartWeb3SignResponseDto],
    })
    @ApiBadRequestResponse({
        description: 'Requested address or signature is not valid',
    })
    @ApiConflictResponse({
        description: 'Requested address already exists',
    })
    @ApiForbiddenResponse({
        description: "Can't associate account when not signed in",
    })
    async confirmAssociatingAddress(
        @Body() confirmRequest: ConfirmWeb3SignUpRequestDto,
        @Res() res: Response,
        @ReqSession() session: SessionData,
    ) {
        await this.authWeb3Service.confirmAssociatingAddress(confirmRequest, res, session)
        res.status(HttpStatus.OK).send()
    }
}
