import { Nil } from '../util/types'
import { MilestoneDetailsDto } from './milestone-details.dto'

export function compareMilestoneDetails(a: MilestoneDetailsDto, b: MilestoneDetailsDto): number {
    const compareDateFrom = compareNilDates(a.dateFrom, b.dateFrom)
    if (compareDateFrom !== 0) {
        return compareDateFrom
    }

    const compareDateTo = compareNilDates(a.dateTo, b.dateTo)
    if (compareDateTo !== 0) {
        return compareDateTo
    }

    return a.createdAt.getTime() - b.createdAt.getTime()
}

function compareNilDates(a: Nil<Date>, b: Nil<Date>): number {
    if (a && b) {
        return a.valueOf() - b.valueOf()
    }
    if (a && !b) {
        return -1
    }
    if (!a && b) {
        return 1
    }
    return 0
}
