import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export enum ProposalFilter {
    All = 'all',
    Mine = 'mine',
    Submitted = 'submitted',
    Approved = 'approved'
}


export const ProposalFilterSearchParamName = 'filter'
export const ProposalDefaultFilter = ProposalFilter.All

export default () => {
    const { search } = useLocation()
    const proposalsFilter = useMemo(() => {
        const filterParam = new URLSearchParams(search).get(ProposalFilterSearchParamName)
        return filterParam ? (filterParam as ProposalFilter) : ProposalDefaultFilter
    }, [search])
    return { proposalsFilter }
}
