import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { ConfirmSignMessageRequestDto } from '../../signMessage/confirm-sign-message-request.dto'
import { Web3SignUpRequestDetails } from './confirm-web3-sign-up-request-details.dto'

export class ConfirmWeb3SignUpRequestDto extends ConfirmSignMessageRequestDto {
    @ApiProperty({ description: 'Network details', type: Web3SignUpRequestDetails })
    @IsNotEmpty()
    details!: Web3SignUpRequestDetails
}
