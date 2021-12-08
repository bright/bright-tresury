import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumberString, IsOptional, Max } from 'class-validator'

export class PaginatedQueryParams {
    @ApiPropertyOptional({
        description: 'Number of the page to take (the first page has number 1)',
        default: 1,
    })
    @IsNumberString()
    @IsOptional()
    pageNumber?: string

    @ApiPropertyOptional({
        description: 'Number of records in a page',
        default: 50,
    })
    @IsNumberString()
    @IsOptional()
    pageSize?: string
}

export class PaginatedParams {
    pageNumber: number
    pageSize: number

    constructor({ pageNumber, pageSize }: PaginatedQueryParams) {
        this.pageNumber = Number(pageNumber ?? 1)
        this.pageSize = Math.min(Number(pageSize ?? 50), 1000)
    }

    get offset(): number {
        return this.pageSize * (this.pageNumber - 1)
    }
    get limit(): number {
        return this.pageNumber*this.pageSize
    }
}
