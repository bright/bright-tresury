import { apiGet } from '../api'
import { ProposalDto } from './proposals.dto'
import { useQuery } from 'react-query'

// GET ALL

export function getProposals(network: string) {
    return apiGet<ProposalDto[]>(`/proposals/?network=${network}`)
}

export const useGetProposals = (network: string) => {
    return useQuery(['proposals', network], () => getProposals(network))
}

// GET ONE

export function getProposal(index: string, network: string) {
    return apiGet<ProposalDto>(`/proposals/${index}?network=${network}`)
}

export const useGetProposal = (index: string, network: string) => {
    return useQuery(['proposals', index, network], () => getProposal(index, network))
}
