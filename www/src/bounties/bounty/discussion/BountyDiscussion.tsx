import React, { useMemo } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { BountyDiscussionDto, DiscussionCategory } from '../../../discussion/comments.dto'
import Discussion from '../../../discussion/Discussion'
import { useNetworks } from '../../../networks/useNetworks'
import PrivateBountyDiscussion from './PrivateBountyDiscussion'

interface OwnProps {
    bountyIndex: number
}
export type BountyDiscussionProps = OwnProps
const BountyDiscussion = ({ bountyIndex }: BountyDiscussionProps) => {
    const { user, isUserSignedInAndVerified } = useAuth()
    const { network } = useNetworks()

    const discussion: BountyDiscussionDto = useMemo(
        () => ({ category: DiscussionCategory.Bounty, blockchainIndex: bountyIndex, networkId: network.id }),
        [bountyIndex, network],
    )

    return (
        <>
            {user && isUserSignedInAndVerified ? (
                <PrivateBountyDiscussion discussion={discussion} userId={user.id} />
            ) : (
                <Discussion discussion={discussion} />
            )}
        </>
    )
}

export default BountyDiscussion
