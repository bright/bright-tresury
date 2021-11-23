import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Nil } from '../../utils/types'

export class UpdateBountyDto {
    @ApiPropertyOptional({ description: 'Title of the bounty proposal' })
    @IsOptional()
    title?: string

    @ApiPropertyOptional({ description: 'Field of the bounty proposal' })
    @IsOptional()
    field?: Nil<string>

    @ApiPropertyOptional({ description: 'Description of the bounty proposal' })
    @IsOptional()
    description?: Nil<string>
}
