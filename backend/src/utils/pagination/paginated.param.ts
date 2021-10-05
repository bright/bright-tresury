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
    @Max(1000)
    pageSize?: string
}

export class PaginatedParams {
    pageNumber: number
    pageSize: number
    offset: number

    constructor({ pageNumber, pageSize }: PaginatedQueryParams) {
        this.pageNumber = Number(pageNumber ?? 1)
        this.pageSize = Number(pageSize ?? 50)
        this.offset = this.pageSize * (this.pageNumber - 1)
    }
}
