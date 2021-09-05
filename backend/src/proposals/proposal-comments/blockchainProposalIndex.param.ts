import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class BlockchainProposalIndex {
    @ApiProperty({
        description: 'Blockchain proposal index',
    })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    blockchainProposalIndex!: number
}
