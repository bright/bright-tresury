import React, { useMemo } from 'react'
import { DiscussionCategory, TipDiscussionDto } from '../../../discussion/comments.dto'
import Discussion from '../../../discussion/Discussion'
import { useNetworks } from '../../../networks/useNetworks'
import { TipDto } from '../../tips.dto'
import { useAuth } from '../../../auth/AuthContext'
import PrivateTipDiscussion from './PrivateTipDiscussion'

interface OwnProps {
    tip: TipDto
}

export type TipDiscussionProps = OwnProps

const TipDiscussion = ({ tip }: TipDiscussionProps) => {
    const { user, isUserSignedInAndVerified } = useAuth()
    const { network } = useNetworks()

    const discussion: TipDiscussionDto = useMemo(
        () => ({
            category: DiscussionCategory.Tip,
            blockchainHash: tip.hash,
            networkId: network.id,
        }),
        [tip.hash, network],
    )

    return (
        <>
            {user && isUserSignedInAndVerified ? (
                <PrivateTipDiscussion discussion={discussion} userId={user.id} tip={tip} />
            ) : (
                <Discussion discussion={discussion} discussedEntity={tip} />
            )}
        </>
    )
}

export default TipDiscussion
