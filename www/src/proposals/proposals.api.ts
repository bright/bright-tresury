import { apiGet, getUrlSearchParams } from '../api'
import { ProposalDto, ProposalStatus } from './proposals.dto'
import { MotionDto } from '../components/voting/motion.dto'
import { useInfiniteQuery, useQuery, UseQueryOptions } from 'react-query'
import { PaginationRequestParams } from '../util/pagination/pagination.request.params'
import { PaginationResponseDto } from '../util/pagination/pagination.response.dto'
import { TimeFrame } from '../util/useTimeFrame'
import { Nil } from '../util/types'

export const PROPOSALS_API_PATH = '/proposals'

// GET (paginated) ALL

interface GetProposalsApiParams {
    network: string
    ownerId: Nil<string>
    status: Nil<ProposalStatus>
    timeFrame: TimeFrame
}

function getProposals(params: GetProposalsApiParams & PaginationRequestParams) {
    const url = `${PROPOSALS_API_PATH}?${getUrlSearchParams(params).toString()}`
    return apiGet<PaginationResponseDto<ProposalDto>>(url)
}

export function useGetProposals({
    network,
    ownerId,
    status,
    timeFrame,
    pageNumber,
    pageSize,
}: GetProposalsApiParams & PaginationRequestParams) {
    return useInfiniteQuery(
        ['proposals', network, ownerId, status, timeFrame],
        ({ pageParam = pageNumber }) =>
            getProposals({ network, ownerId, status, timeFrame, pageNumber: pageParam, pageSize }),
        {
            getNextPageParam: (lastPage, allPages) => allPages.length + 1,
        },
    )
}

// GET ONE

function getProposal(index: string, network: string) {
    return apiGet<ProposalDto>(`${PROPOSALS_API_PATH}/${index}?${getUrlSearchParams({ network })}`)
}

export const useGetProposal = (index: string, network: string, options?: UseQueryOptions<ProposalDto>) => {
    return useQuery(['proposals', index, network], () => getProposal(index, network), options)
}

// GET PROPOSAL MOTIONS FROM POLKASSEMBLY

export const PROPOSAL_MOTIONS_QUERY_KEY_BASE = 'motions'

async function getMotions(proposalIndex: number, network: string): Promise<MotionDto[]> {
    return apiGet<MotionDto[]>(
        `${PROPOSALS_API_PATH}/${proposalIndex}/${PROPOSAL_MOTIONS_QUERY_KEY_BASE}/?${getUrlSearchParams({ network })}`,
    )
}

export const useGetMotions = ({ proposalIndex, network }: { proposalIndex: number; network: string }) => {
    return useQuery([PROPOSALS_API_PATH, PROPOSAL_MOTIONS_QUERY_KEY_BASE, proposalIndex, network], () =>
        getMotions(proposalIndex, network),
    )
}
