import React from 'react'
import NoMotion from '../../../components/voting/NoMotion'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { ROUTE_PROPOSAL } from '../../../routes/routes'
import { ProposalContentType } from '../ProposalContentTypeTabs'

export interface NoProposalMotionProps {
    blockchainIndex: number
}

const NoProposalMotion = ({ blockchainIndex }: NoProposalMotionProps) => {
    const { t } = useTranslation()
    const toDiscussionLink = `${generatePath(ROUTE_PROPOSAL, { proposalIndex: blockchainIndex })}/${
        ProposalContentType.Discussion
    }`

    return <NoMotion title={t('proposal.voting.noMotion.title')} toDiscussion={toDiscussionLink} />
}

export default NoProposalMotion
