import { useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from 'react-query'
import { apiGet, apiPatch, apiPost, getUrlSearchParams } from '../api'
import { BountyDto, BountyExtrinsicDto, CreateBountyDto, EditBountyDto } from './bounties.dto'
import { MotionDto } from '../components/voting/motion.dto'
import { PaginationResponseDto } from '../util/pagination/pagination.response.dto'
import { TimeFrame } from '../util/useTimeFrame'

export const BOUNTIES_API_PATH = '/bounties'

// GET ONE

async function getBounty(bountyIndex: string, network: string): Promise<BountyDto> {
    return apiGet<BountyDto>(`${BOUNTIES_API_PATH}/${bountyIndex}?network=${network}`)
}

export const BOUNTY_QUERY_KEY_BASE = 'bounty'

export const useGetBounty = (
    { bountyIndex, network }: { bountyIndex: string; network: string },
    options?: UseQueryOptions<BountyDto>,
) => {
    return useQuery([BOUNTY_QUERY_KEY_BASE, bountyIndex, network], () => getBounty(bountyIndex, network), options)
}

// POST

async function createBounty(data: CreateBountyDto): Promise<BountyExtrinsicDto> {
    return apiPost(`${BOUNTIES_API_PATH}`, data)
}

export const useCreateBounty = () => {
    return useMutation(createBounty)
}

// PATCH

export interface PatchBountyParams {
    bountyIndex: string
    network: string
    data: EditBountyDto
}

async function patchBounty({ bountyIndex, network, data }: PatchBountyParams): Promise<BountyDto> {
    return apiPatch<BountyDto>(`${BOUNTIES_API_PATH}/${bountyIndex}?network=${network}`, data)
}

export const usePatchBounty = () => {
    return useMutation(patchBounty)
}

// GET ALL

async function getBounties(
    network: string,
    timeFrame: TimeFrame,
    pageNumber: number,
    pageSize: number = 10,
): Promise<PaginationResponseDto<BountyDto>> {
    //TODO: TREAS-341: use interface for params
    const params = { network, timeFrame, pageNumber, pageSize }
    const url = `${BOUNTIES_API_PATH}?${getUrlSearchParams(params)}`
    return apiGet<PaginationResponseDto<BountyDto>>(url)
}

export const BOUNTIES_QUERY_KEY_BASE = 'bounties'

export const useGetBounties = (network: string, timeFrame: TimeFrame, pageSize?: number) => {
    //TODO: TREAS-341: use interface for params
    return useInfiniteQuery(
        [BOUNTIES_QUERY_KEY_BASE, network, timeFrame],
        ({ pageParam }) => getBounties(network, timeFrame, pageParam, pageSize),
        {
            getNextPageParam: (lastPage, allPages) => allPages.length + 1,
        },
    )
}

// GET BOUNTY MOTIONS

export const BOUNTY_MOTIONS_QUERY_KEY_BASE = 'motions'

async function getBountyVoting(bountyIndex: string, network: string): Promise<MotionDto[]> {
    return apiGet<MotionDto[]>(
        `${BOUNTIES_API_PATH}/${bountyIndex}/${BOUNTY_MOTIONS_QUERY_KEY_BASE}/?network=${network}`,
    )
}

export const useGetBountyVoting = ({ bountyIndex, network }: { bountyIndex: string; network: string }) => {
    return useQuery([BOUNTY_QUERY_KEY_BASE, BOUNTY_MOTIONS_QUERY_KEY_BASE, bountyIndex, network], () =>
        getBountyVoting(bountyIndex, network),
    )
}
