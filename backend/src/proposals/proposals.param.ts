import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class ProposalsParam {
    @ApiProperty({
        description: 'Proposal index',
    })
    @IsNumberString()
    @IsNotEmpty()
    proposalIndex!: string
}
