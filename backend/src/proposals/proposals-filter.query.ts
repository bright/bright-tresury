import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export enum ProposalsFilterEnum {
    All = 'all',
    Mine = 'mine',
    Submitted = 'submitted',
    Approved = 'approved',
}

export class ProposalsFilterQuery {
    @ApiPropertyOptional({
        description: 'Proposals filter',
        enum: ProposalsFilterEnum,
    })
    @IsOptional()
    filter?: ProposalsFilterEnum
}
