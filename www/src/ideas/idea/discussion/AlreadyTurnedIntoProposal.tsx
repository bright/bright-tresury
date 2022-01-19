import React from 'react'
import { Trans } from 'react-i18next'
import DiscussionInfoBox from '../../../components/discussion/DiscussionInfoBox'
import RouterLink from '../../../components/link/RouterLink'
import { generatePath } from 'react-router'
import { ROUTE_PROPOSAL } from '../../../routes/routes'
import { ProposalContentType } from '../../../proposals/proposal/ProposalContentTypeTabs'

interface OwnProps {
    proposalIndex: number
}

export type AlreadyTurnedIntoProposalProps = OwnProps

const AlreadyTurnedIntoProposal = ({ proposalIndex }: AlreadyTurnedIntoProposalProps) => {
    const to = generatePath(`${ROUTE_PROPOSAL}/${ProposalContentType.Discussion}`, { proposalIndex })
    return (
        <DiscussionInfoBox>
            {
                <Trans
                    id="discussion-already-proposal"
                    i18nKey="discussion.ideaAlreadyTurnedIntoProposal"
                    components={{ a: <RouterLink to={to} replace={true} /> }}
                />
            }
        </DiscussionInfoBox>
    )
}
export default AlreadyTurnedIntoProposal
