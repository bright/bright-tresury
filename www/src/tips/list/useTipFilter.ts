import { useParamFromQuery } from '../../util/useParamFromQuery'

export enum TipFilter {
    All = 'all',
    Mine = 'mine',
    Proposed = 'proposed',
    Tipped = 'tipped',
    Closing = 'closing',
    PendingPayout = 'pending-payout',
}
export const TipFilterSearchParamName = 'filter'
export const TipDefaultFilter = TipFilter.All

export const useTipFilter = () =>
    useParamFromQuery({
        enumObject: TipFilter,
        paramName: TipFilterSearchParamName,
        defaultValue: TipDefaultFilter,
        preserveParam: true,
    })
