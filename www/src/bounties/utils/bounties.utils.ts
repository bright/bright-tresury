import { BountyDto } from '../bounties.dto'
import { useBounty } from '../bounty/useBounty'

export function DoesBountyBelongToUser(bounty: BountyDto) {
    const { isOwner, isCurator, isProposer, isBeneficiary } = useBounty(bounty)
    return isOwner || isProposer || isCurator || isBeneficiary
}
