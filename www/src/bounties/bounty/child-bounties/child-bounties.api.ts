import { apiGet, apiPost, getUrlSearchParams } from '../../../api'
import { useQuery, useMutation, UseQueryOptions } from 'react-query'
import { BOUNTIES_API_PATH } from '../../bounties.api'
import { ChildBountyDto, CreateChildBountyDto } from './child-bounties.dto'

const getChildBountiesApiBasePath = (bountyIndex: number | string) =>
    `${BOUNTIES_API_PATH}/${bountyIndex}/child-bounties`

export const CHILD_BOUNTIES_API_PATH = '/child-bounties'

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
) => {
    return useQuery(
        [CHILD_BOUNTY_QUERY_KEY_BASE, bountyIndex, childBountyIndex, network],
        () => getChildBounty(bountyIndex, childBountyIndex, network),
        options,
    )
}

const createChildBounty = ({ parentIndex, ...data }: CreateChildBountyDto) =>
    apiPost(getChildBountiesApiBasePath(parentIndex), data)

export const useCreateChildBounty = () => {
    return {
        mutateAsync: (data: any) => {
            console.log('Should sent create child bounty post request with data', data)
        },
    }
    // return useMutation(createChildBounty)
}
