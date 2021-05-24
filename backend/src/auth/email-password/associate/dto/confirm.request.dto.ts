import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {ConfirmSignMessageRequestDto} from "../../../web3/signMessage/confirm-sign-message-request.dto";
import {EmailPasswordAssociateRequestDetails} from "./request-details.dto";

export class ConfirmEmailPasswordAssociateRequestDto extends ConfirmSignMessageRequestDto {
    @ApiProperty({description: 'Email-password account details', type: EmailPasswordAssociateRequestDetails})
    @IsNotEmpty()
    details!: EmailPasswordAssociateRequestDetails
}
