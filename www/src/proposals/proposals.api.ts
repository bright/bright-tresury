import { apiGet } from '../api'
import { ProposalDto } from './proposals.dto'
import { useQuery, UseQueryOptions } from 'react-query'

const PROPOSALS_API_PATH = '/proposals'

// GET ALL

function getProposals(network: string) {
    return apiGet<ProposalDto[]>(`${PROPOSALS_API_PATH}/?network=${network}`)
}

export const useGetProposals = (network: string, options?: UseQueryOptions<ProposalDto[]>) => {
    return useQuery(['proposals', network], () => getProposals(network), options)
}

// GET ONE

function getProposal(index: string, network: string) {
    return apiGet<ProposalDto>(`${PROPOSALS_API_PATH}/${index}?network=${network}`)
}

export const useGetProposal = (index: string, network: string, options?: UseQueryOptions<ProposalDto>) => {
    return useQuery(['proposals', index, network], () => getProposal(index, network), options)
}
