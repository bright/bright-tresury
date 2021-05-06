import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class StartWeb3SignUpRequest {
    @ApiProperty({description: 'Blockchain address used for sign up'})
    @IsNotEmpty()
    address!: string
}

export class StartBlockchainSignUpResponse {
    @ApiProperty({description: 'Sign message which the client should sign in order to sign up'})
    signMessage: string

    constructor(signMessage: string) {
        this.signMessage = signMessage
    }
}
