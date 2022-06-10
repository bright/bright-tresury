import { apiGet, apiPatch, apiPost, getUrlSearchParams } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { BOUNTIES_API_PATH } from '../../bounties.api'
import { ChildBountyDto, CreateChildBountyDto, EditChildBountyDto } from './child-bounties.dto'

export const CHILD_BOUNTIES_API_PATH = '/child-bounties'
const getChildBountiesApiBasePath = (bountyIndex: number | string) =>
    `${BOUNTIES_API_PATH}/${bountyIndex}/child-bounties`
// GET ALL FOR PARENT BOUNTY
export const CHILD_BOUNTIES_QUERY_KEY_BASE = 'child-bounties'

async function getChildBounties(bountyIndex: string, network: string): Promise<ChildBountyDto[]> {
    return apiGet<ChildBountyDto[]>(
        `${getChildBountiesApiBasePath(bountyIndex)}?${getUrlSearchParams({ network }).toString()}`,
    )
}

export const useGetChildBounties = (
    { bountyIndex, network }: { bountyIndex: string; network: string },
    options?: UseQueryOptions<ChildBountyDto[]>,
) =>
    useQuery(
        [CHILD_BOUNTIES_QUERY_KEY_BASE, bountyIndex, network],
        () => getChildBounties(bountyIndex, network),
        options,
    )

// GET ONE

async function getChildBounty(bountyIndex: string, childBountyIndex: string, network: string): Promise<ChildBountyDto> {
    return apiGet<ChildBountyDto>(
        `${getChildBountiesApiBasePath(bountyIndex)}/${childBountyIndex}?${getUrlSearchParams({
            network,
        }).toString()}`,
    )
}

export const CHILD_BOUNTY_QUERY_KEY_BASE = 'child-bounty'

export const useGetChildBounty = (
    { bountyIndex, childBountyIndex, network }: { bountyIndex: string; childBountyIndex: string; network: string },
    options?: UseQueryOptions<ChildBountyDto>,
) =>
    useQuery(
        [CHILD_BOUNTY_QUERY_KEY_BASE, bountyIndex, childBountyIndex, network],
        () => getChildBounty(bountyIndex, childBountyIndex, network),
        options,
    )

// CREATE

const createChildBounty = ({ parentIndex, ...data }: CreateChildBountyDto) =>
    apiPost(getChildBountiesApiBasePath(parentIndex), data)

export const useCreateChildBounty = () => useMutation(createChildBounty)

// PATCH

export interface PatchChildBountyParams {
    bountyIndex: string
    childBountyIndex: string
    network: string
    data: EditChildBountyDto
}

async function patchChildBounty({
    bountyIndex,
    childBountyIndex,
    network,
    data,
}: PatchChildBountyParams): Promise<ChildBountyDto> {
    return apiPatch<ChildBountyDto>(
        `${getChildBountiesApiBasePath(bountyIndex)}/${childBountyIndex}?${getUrlSearchParams({
            network,
        }).toString()}`,
        data,
    )
}

export const usePatchChildBounty = () => {
    return useMutation(patchChildBounty)
}
