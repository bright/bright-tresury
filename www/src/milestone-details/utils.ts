import { Nil } from '../util/types'
import { MilestoneDetailsDto } from './milestone-details.dto'

export function compareMilestones(a: MilestoneDetailsDto, b: MilestoneDetailsDto): number {
    const compareDateFrom = compareNilDates(a.dateFrom, a.dateTo)
    if (compareDateFrom !== 0) {
        return compareDateFrom
    }

    const compareDateTo = compareNilDates(a.dateFrom, a.dateTo)
    if (compareDateTo !== 0) {
        return compareDateTo
    }

    return a.createdAt.getTime() - b.createdAt.getTime()
}

function compareNilDates(a: Nil<Date>, b: Nil<Date>): number {
    if (a && b) {
        return a.getTime() - b.getTime()
    }
    if (a && !b) {
        return 1
    }
    if (!a && b) {
        return -1
    }
    return 0
}
