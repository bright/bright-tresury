import { Nil } from '../util/types'

export interface MilestoneDetailsDto {
    subject: string
    dateFrom: Nil<Date>
    dateTo: Nil<Date>
    description: Nil<string>
}
