import React, { useMemo } from 'react'
import { ChildBountyDto } from '../../child-bounties.dto'
import { useNetworks } from '../../../../../networks/useNetworks'
import { ChildBountyDiscussionDto, DiscussionCategory } from '../../../../../discussion/comments.dto'
import Discussion from '../../../../../discussion/Discussion'

interface OwnProps {
    childBounty: ChildBountyDto
}
export type ChildBountyDiscussionProps = OwnProps
const ChildBountyDiscussion = ({ childBounty }: ChildBountyDiscussionProps) => {
    const { network } = useNetworks()

    const discussion: ChildBountyDiscussionDto = useMemo(
        () => ({
            category: DiscussionCategory.ChildBounty,
            blockchainIndex: Number(childBounty.blockchainIndex),
            parentBountyBlockchainIndex: childBounty.parentBountyBlockchainIndex,
            networkId: network.id,
        }),
        [childBounty.blockchainIndex, childBounty.parentBountyBlockchainIndex, network],
    )

    return <Discussion discussion={discussion} discussedEntity={childBounty} />
}

export default ChildBountyDiscussion
