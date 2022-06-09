import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Nil } from '../../../utils/types'

export class UpdateChildBountyDto {
    @ApiPropertyOptional({ description: 'Title of the child bounty proposal' })
    @IsOptional()
    title?: string

    @ApiPropertyOptional({ description: 'Description of the child bounty proposal' })
    @IsOptional()
    description?: Nil<string>
}
