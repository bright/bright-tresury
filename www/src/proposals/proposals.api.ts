import { apiGet } from '../api'
import { ProposalDto } from './proposals.dto'
import { useQuery, UseQueryOptions } from 'react-query'

// GET ALL

export function getProposals(network: string) {
    return apiGet<ProposalDto[]>(`/proposals/?network=${network}`)
}

export const useGetProposals = (network: string, options?: UseQueryOptions<ProposalDto[]>) => {
    return useQuery(['proposals', network], () => getProposals(network), options)
}

// GET ONE

export function getProposal(index: string, network: string) {
    return apiGet<ProposalDto>(`/proposals/${index}?network=${network}`)
}

export const useGetProposal = (index: string, network: string, options?: UseQueryOptions<ProposalDto>) => {
    return useQuery(['proposals', index, network], () => getProposal(index, network), options)
}
