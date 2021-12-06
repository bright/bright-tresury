import React from 'react'
import NoMotion from '../../../components/voting/NoMotion'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { ROUTE_BOUNTIES, ROUTE_BOUNTY_DISCUSSION } from '../../../routes/routes'

export interface NoProposalMotionProps {
    blockchainIndex: number
}

const NoBountyMotion = ({ blockchainIndex }: NoProposalMotionProps) => {
    const { t } = useTranslation()
    const toDiscussionLink = `${generatePath(ROUTE_BOUNTIES, { blockchainIndex })}/${ROUTE_BOUNTY_DISCUSSION}`

    return <NoMotion title={t('bounty.voting.noMotion.title')} toDiscussion={toDiscussionLink} />
}

export default NoBountyMotion
