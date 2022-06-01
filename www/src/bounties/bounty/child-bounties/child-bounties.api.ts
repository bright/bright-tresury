import { apiGet, apiPost, getUrlSearchParams } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { BOUNTIES_API_PATH } from '../../bounties.api'
import { ChildBountyDto, CreateChildBountyDto } from './child-bounties.dto'

const getChildBountiesApiBasePath = (bountyIndex: number | string) =>
    `${BOUNTIES_API_PATH}/${bountyIndex}/child-bounties`

export const CHILD_BOUNTIES_API_PATH = '/child-bounties'

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

const createChildBounty = ({ parentIndex, ...data }: CreateChildBountyDto) =>
    apiPost(getChildBountiesApiBasePath(parentIndex), data)

export const useCreateChildBounty = () => useMutation(createChildBounty)
