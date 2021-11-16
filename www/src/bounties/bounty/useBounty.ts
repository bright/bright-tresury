import { Nil } from '../../util/types'
import { BountyDto } from '../bounties.dto'

export interface UseBountyResult {}

export const useBounty = (bounty: Nil<BountyDto>): UseBountyResult => {
    return {}
}
