import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsValidAddress } from '../../utils/address/address.validator'
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

    @ApiPropertyOptional({ description: 'Beneficiary of the bounty proposal' })
    @IsOptional()
    @IsValidAddress()
    beneficiary?: Nil<string>
}
