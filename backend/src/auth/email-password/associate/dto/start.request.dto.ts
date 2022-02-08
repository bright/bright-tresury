import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { StartSignMessageRequestDto } from '../../../web3/signMessage/dto/start-sign-message-request.dto'
import { EmailPasswordAssociateRequestDetails } from './request-details.dto'

export class StartEmailPasswordAssociateRequestDto extends StartSignMessageRequestDto {
    @ApiProperty({ description: 'Email-password account details', type: EmailPasswordAssociateRequestDetails })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => EmailPasswordAssociateRequestDetails)
    details!: EmailPasswordAssociateRequestDetails
}
