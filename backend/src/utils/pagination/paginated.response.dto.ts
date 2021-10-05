import { ApiProperty } from '@nestjs/swagger'
import { SelectQueryBuilder } from 'typeorm'
import { PaginatedParams } from './paginated.param'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
}

export class PaginatedResponseDto<T> {
    @ApiProperty({
        description: 'Items',
    })
    items!: T[]

    @ApiProperty({
        description: 'Total number of items',
    })
    total!: number

    static async fromQuery<T>(
        query: SelectQueryBuilder<T>,
        paginated?: PaginatedParams,
    ): Promise<PaginatedResponseDto<T>> {
        const response = new PaginatedResponseDto<T>()
        response.items = await query.offset(paginated?.offset).limit(paginated?.pageSize).getMany()
        response.total = await query.getCount()

        return response
    }
}
