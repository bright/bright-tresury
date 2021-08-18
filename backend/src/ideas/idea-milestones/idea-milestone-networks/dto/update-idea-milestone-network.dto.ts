import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class UpdateIdeaMilestoneNetworkDto {
    @ApiProperty({
        description: 'Reward for the idea in the network',
        type: Number,
    })
    @IsNumber()
    @Min(0)
    value!: number
}
