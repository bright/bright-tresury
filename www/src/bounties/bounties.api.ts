import { useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from 'react-query'
import { apiGet, apiPatch, apiPost, getUrlSearchParams } from '../api'
import { BountyDto, BountyExtrinsicDto, BountyStatus, CreateBountyDto, EditBountyDto } from './bounties.dto'
import { MotionDto } from '../components/voting/motion.dto'
import { PaginationResponseDto } from '../util/pagination/pagination.response.dto'
import { TimeFrame } from '../util/useTimeFrame'
import { Nil } from '../util/types'
import { PaginationRequestParams } from '../util/pagination/pagination.request.params'
import { PublicUserDto } from '../util/publicUser.dto'

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

async function getBountyCurator(bountyIndex: string, network: string): Promise<Nil<PublicUserDto>> {
    return apiGet<Nil<PublicUserDto>>(`${BOUNTIES_API_PATH}/${bountyIndex}/curator?network=${network}`)
}

export const useGetBountyCurator = (
    { bountyIndex, network }: { bountyIndex: string; network: string },
    options?: UseQueryOptions<Nil<PublicUserDto>>,
) => {
    return useQuery(
        [BOUNTY_QUERY_KEY_BASE, 'curator', bountyIndex, network],
        () => getBountyCurator(bountyIndex, network),
        options,
    )
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
interface GetBountiesApiParams {
    network: string
    ownerId: Nil<string>
    status: Nil<BountyStatus>
    timeFrame: TimeFrame
}

async function getBounties(params: GetBountiesApiParams & PaginationRequestParams) {
    const url = `${BOUNTIES_API_PATH}?${getUrlSearchParams(params).toString()}`
    return apiGet<PaginationResponseDto<BountyDto>>(url)
}

export const BOUNTIES_QUERY_KEY_BASE = 'bounties'

export const useGetBounties = ({
    network,
    ownerId,
    status,
    timeFrame,
    pageNumber,
    pageSize,
}: GetBountiesApiParams & PaginationRequestParams) => {
    return useInfiniteQuery(
        [BOUNTIES_QUERY_KEY_BASE, network, ownerId, status, timeFrame],
        ({ pageParam = pageNumber }) =>
            getBounties({ network, ownerId, status, timeFrame, pageNumber: pageParam, pageSize }),
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
