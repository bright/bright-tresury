import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class ProposalParam {
    @ApiProperty({
        description: 'Proposal blockchain index',
    })
    @IsNumberString()
    @IsNotEmpty()
    proposalIndex!: string
}
