import { useParamFromQuery, UseParamFromQueryResult } from '../util/useParamFromQuery'

export enum ProposalFilter {
    All = 'all',
    Mine = 'mine',
    Submitted = 'submitted',
    Approved = 'approved',
}
export const ProposalFilterSearchParamName = 'filter'
export const ProposalDefaultFilter = ProposalFilter.All

export type UseProposalsFilterResult = UseParamFromQueryResult<ProposalFilter> & {
    setFilter: (filter: ProposalFilter) => string
}

export const useProposalsFilter = () =>
    useParamFromQuery({
        enumObject: ProposalFilter,
        paramName: ProposalFilterSearchParamName,
        defaultValue: ProposalDefaultFilter,
        preserveParam: true,
    })
