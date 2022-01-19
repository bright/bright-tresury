import { useParamFromQuery } from './useParamFromQuery'

export enum TimeFrame {
    OnChain = 'onChain',
    History = 'history'
}

export const TimeSelectFilterSearchParamName = 'timeFrame'
export const TimeSelectDefaultFilter = TimeFrame.OnChain

export const useTimeFrame = () =>
    useParamFromQuery({
        enumObject: TimeFrame,
        paramName:TimeSelectFilterSearchParamName,
        defaultValue: TimeSelectDefaultFilter,
        preserveParam: false
    })
