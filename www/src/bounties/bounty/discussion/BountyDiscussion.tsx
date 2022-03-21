import React, { useMemo } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { BountyDiscussionDto, DiscussionCategory } from '../../../discussion/comments.dto'
import Discussion from '../../../discussion/Discussion'
import { useNetworks } from '../../../networks/useNetworks'
import { BountyDto } from '../../bounties.dto'
import PrivateBountyDiscussion from './PrivateBountyDiscussion'

interface OwnProps {
    bounty: BountyDto
}
export type BountyDiscussionProps = OwnProps
const BountyDiscussion = ({ bounty }: BountyDiscussionProps) => {
    const { user, isUserSignedInAndVerified } = useAuth()
    const { network } = useNetworks()

    const discussion: BountyDiscussionDto = useMemo(
        () => ({ category: DiscussionCategory.Bounty, blockchainIndex: bounty.blockchainIndex, networkId: network.id }),
        [bounty.blockchainIndex, network],
    )

    return (
        <>
            {user && isUserSignedInAndVerified ? (
                <PrivateBountyDiscussion discussion={discussion} userId={user.id} bounty={bounty} />
            ) : (
                <Discussion discussion={discussion} discussedEntity={bounty} />
            )}
        </>
    )
}

export default BountyDiscussion
