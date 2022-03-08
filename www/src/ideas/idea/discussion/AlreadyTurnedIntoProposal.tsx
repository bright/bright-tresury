import React from 'react'
import { Trans } from 'react-i18next'
import { generatePath } from 'react-router'
import RouterLink from '../../../components/link/RouterLink'
import { ProposalContentType } from '../../../proposals/proposal/ProposalContentTypeTabs'
import { ROUTE_PROPOSAL } from '../../../routes/routes'

interface OwnProps {
    proposalIndex: number
}

export type AlreadyTurnedIntoProposalProps = OwnProps

const AlreadyTurnedIntoProposal = ({ proposalIndex }: AlreadyTurnedIntoProposalProps) => {
    const to = generatePath(`${ROUTE_PROPOSAL}/${ProposalContentType.Discussion}`, { proposalIndex })
    return (
        <Trans
            id="discussion-already-proposal"
            i18nKey="discussion.ideaAlreadyTurnedIntoProposal"
            components={{ a: <RouterLink to={to} replace={true} /> }}
        />
    )
}
export default AlreadyTurnedIntoProposal
