import { Nil } from '../util/types'

export interface MilestoneDetailsDto {
    subject: string
    dateFrom: Nil<Date>
    dateTo: Nil<Date>
    description: Nil<string>
    createdAt: Date
    updatedAt: Date
}

export interface ApiMilestoneDetailsDto {
    subject: string
    dateFrom: Nil<string>
    dateTo: Nil<string>
    description: Nil<string>
    createdAt: string
    updatedAt: string
}

export interface CreateMilestoneDetailsDto {
    subject: string
    dateFrom: Nil<Date>
    dateTo: Nil<Date>
    description: Nil<string>
}

export type UpdateMilestoneDetailsDto = Partial<CreateMilestoneDetailsDto>

export function toMilestoneDetailsDto(apiDto: ApiMilestoneDetailsDto) {
    return {
        ...apiDto,
        dateFrom: !!apiDto.dateFrom ? new Date(apiDto.dateFrom) : null,
        dateTo: !!apiDto.dateTo ? new Date(apiDto.dateTo) : null,
        createdAt: new Date(apiDto.createdAt),
        updatedAt: new Date(apiDto.updatedAt),
    }
}
