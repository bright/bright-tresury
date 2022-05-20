import { apiGet, getUrlSearchParams } from '../../../api'
import { useQuery, UseQueryOptions } from 'react-query'
import { BOUNTIES_API_PATH } from '../../bounties.api'
import { ChildBountyDto } from './child-bounties.dto'

export const CHILD_BOUNTIES_API_PATH = '/child-bounties'

// GET ONE

async function getChildBounty(bountyIndex: string, childBountyIndex: string, network: string): Promise<ChildBountyDto> {
    return apiGet<ChildBountyDto>(
        `${BOUNTIES_API_PATH}/${bountyIndex}${CHILD_BOUNTIES_API_PATH}/${childBountyIndex}?${getUrlSearchParams({
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
