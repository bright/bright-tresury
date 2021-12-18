import { apiGet } from '../api'
import { ProposalDto } from './proposals.dto'
import { MotionDto } from '../components/voting/motion.dto'
import { useInfiniteQuery, useQuery, UseQueryOptions } from 'react-query'
import { getPaginationQueryParams } from '../util/pagination/pagination.request.params'
import { PaginationResponseDto } from '../util/pagination/pagination.response.dto'
import { TimeFrame } from '../components/select/TimeSelect'
export const PROPOSALS_API_PATH = '/proposals'

// GET (paginated) ALL

function getProposals(network: string, timeFrame: TimeFrame, pageNumber: number, pageSize?: number) {
    const url = `${PROPOSALS_API_PATH}?network=${network}&timeFrame=${timeFrame}${getPaginationQueryParams({pageNumber, pageSize: pageSize ?? 10})}`
    return apiGet<PaginationResponseDto<ProposalDto>>(url)
}

export const useGetProposals = (network: string, timeFrame: TimeFrame, pageSize?: number) => {
    return useInfiniteQuery(
        ['proposals', network, timeFrame],
        ({ pageParam = 1 }) => getProposals(network, timeFrame,  pageParam, pageSize ),
        {
            getNextPageParam: (lastPage, allPages) => allPages.length+1
        }
    )
}

// GET ONE

function getProposal(index: string, network: string) {
    return apiGet<ProposalDto>(`${PROPOSALS_API_PATH}/${index}?network=${network}`)
}

export const useGetProposal = (index: string, network: string, options?: UseQueryOptions<ProposalDto>) => {
    return useQuery(['proposals', index, network], () => getProposal(index, network), options)
}

// GET PROPOSAL MOTIONS FROM POLKASSEMBLY

export const PROPOSAL_MOTIONS_QUERY_KEY_BASE = 'motions'

async function getMotions(proposalIndex: number, network: string): Promise<MotionDto[]> {
    return apiGet<MotionDto[]>(
        `${PROPOSALS_API_PATH}/${proposalIndex}/${PROPOSAL_MOTIONS_QUERY_KEY_BASE}/?network=${network}`,
    )
}

export const useGetMotions = ({ proposalIndex, network }: { proposalIndex: number; network: string }) => {
    return useQuery([PROPOSALS_API_PATH, PROPOSAL_MOTIONS_QUERY_KEY_BASE, proposalIndex, network], () =>
        getMotions(proposalIndex, network),
    )
}
