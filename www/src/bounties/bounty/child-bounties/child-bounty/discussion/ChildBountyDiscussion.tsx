import React, { useMemo } from 'react'
import { ChildBountyDto } from '../../child-bounties.dto'
import { useNetworks } from '../../../../../networks/useNetworks'
import { ChildBountyDiscussionDto, DiscussionCategory } from '../../../../../discussion/comments.dto'
import Discussion from '../../../../../discussion/Discussion'
import PrivateBountyDiscussion from '../../../discussion/PrivateBountyDiscussion'
import { useAuth } from '../../../../../auth/AuthContext'
import PrivateChildBountyDiscussion from './PrivateChildBountyDiscussion'

interface OwnProps {
    childBounty: ChildBountyDto
}
export type ChildBountyDiscussionProps = OwnProps
const ChildBountyDiscussion = ({ childBounty }: ChildBountyDiscussionProps) => {
    const { network } = useNetworks()
    const { user, isUserSignedInAndVerified } = useAuth()

    const discussion: ChildBountyDiscussionDto = useMemo(
        () => ({
            category: DiscussionCategory.ChildBounty,
            blockchainIndex: Number(childBounty.blockchainIndex),
            parentBountyBlockchainIndex: childBounty.parentBountyBlockchainIndex,
            networkId: network.id,
        }),
        [childBounty.blockchainIndex, childBounty.parentBountyBlockchainIndex, network],
    )

    return (
        <>
            {user && isUserSignedInAndVerified ? (
                <PrivateChildBountyDiscussion discussion={discussion} userId={user.id} childBounty={childBounty} />
            ) : (
                <Discussion discussion={discussion} discussedEntity={childBounty} />
            )}
        </>
    )
}

export default ChildBountyDiscussion
