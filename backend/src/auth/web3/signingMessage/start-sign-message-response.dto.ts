import { ApiProperty } from '@nestjs/swagger'

export class StartSignMessageResponseDto {
    @ApiProperty({ description: 'Sign message which the client should sign in order to sign up' })
    signMessage: string

    constructor(signMessage: string) {
        this.signMessage = signMessage
    }
}
