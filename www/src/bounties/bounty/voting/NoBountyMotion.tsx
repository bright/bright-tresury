import React from 'react'
import NoMotion from '../../../components/voting/NoMotion'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { ROUTE_BOUNTY_DISCUSSION } from '../../../routes/routes'

export interface NoBountyMotionProps {
    blockchainIndex: number
}

const NoBountyMotion = ({ blockchainIndex }: NoBountyMotionProps) => {
    const { t } = useTranslation()
    const toDiscussionLink = generatePath(ROUTE_BOUNTY_DISCUSSION, { bountyIndex: blockchainIndex })

    return <NoMotion title={t('bounty.voting.noMotion.title')} toDiscussion={toDiscussionLink} />
}

export default NoBountyMotion
