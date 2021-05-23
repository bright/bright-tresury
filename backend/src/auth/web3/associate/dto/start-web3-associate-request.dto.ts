import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { StartSignMessageRequestDto } from '../../signMessage/start-sign-message-request.dto'

export class StartWeb3AssociateRequestDto extends StartSignMessageRequestDto {
    @ApiProperty({
        description: 'Optional password, that is required only when associating address for email account',
    })
    @IsOptional()
    password!: string
}
