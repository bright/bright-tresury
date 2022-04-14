import React, { useMemo } from 'react'
import { DiscussionCategory, TipDiscussionDto } from '../../../discussion/comments.dto'
import Discussion from '../../../discussion/Discussion'
import { useNetworks } from '../../../networks/useNetworks'
import { TipDto } from '../../tips.dto'

interface OwnProps {
    tip: TipDto
}

export type TipDiscussionProps = OwnProps

const TipDiscussion = ({ tip }: TipDiscussionProps) => {
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
            {/*Add private discussion to get notifications about new comments in TREAS-450*/}
            <Discussion discussion={discussion} discussedEntity={tip} />
        </>
    )
}

export default TipDiscussion
