import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { StartWeb3SignRequestDto, StartWeb3SignResponseDto } from './dto/start-web3-sign.dto'
import { ConfirmWeb3SignUpRequestDto } from './dto/confirm-web3-sign-up-request.dto'
import { ConfirmSignMessageRequestDto } from './signingMessage/confirm-sign-message-request.dto'
import { AuthWeb3SignInService } from './signIn/auth-web3-sign-in.service'
import { AuthWeb3SignUpService } from './signUp/auth-web3-sign-up.service'

@Injectable()
export class AuthWeb3Service {
    constructor(
        private readonly signInService: AuthWeb3SignInService,
        private readonly signUpService: AuthWeb3SignUpService,
    ) {}

    async startSignIn(startDto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
        return this.signInService.startSigningMessage(startDto)
    }

    async confirmSignIn(confirmRequest: ConfirmSignMessageRequestDto, res: Response): Promise<void> {
        await this.signInService.confirmSigningMessage(confirmRequest, res)
    }

    async startSignUp(startDto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
        return this.signUpService.startSigningMessage(startDto)
    }

    async confirmSignUp(confirmRequest: ConfirmWeb3SignUpRequestDto, res: Response): Promise<void> {
        return this.signUpService.confirmSigningMessage(confirmRequest, res)
    }
}
