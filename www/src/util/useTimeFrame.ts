import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

export enum TimeFrame {
    OnChain = 'OnChain',
    History = 'History'
}

export const TimeSelectFilterSearchParamName = 'timeFrame'
export const TimeSelectDefaultFilter = TimeFrame.OnChain

export default () => {
    const { search } = useLocation()
    const timeFrame = useMemo(() => {
        const paramFromQuery = new URLSearchParams(search).get(TimeSelectFilterSearchParamName)
        return paramFromQuery ? (paramFromQuery as TimeFrame) : TimeSelectDefaultFilter
    }, [search])
    return { timeFrame }
}
