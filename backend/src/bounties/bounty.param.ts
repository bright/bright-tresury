import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class BountyParam {
    @ApiProperty({
        description: 'Bounty blockchain index',
    })
    @IsNumberString()
    @IsNotEmpty()
    bountyIndex!: string
}
