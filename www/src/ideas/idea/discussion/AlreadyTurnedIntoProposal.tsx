import React from 'react'
import { styled } from '@material-ui/core'
import { Trans } from 'react-i18next'
import RouterLink from '../../../components/link/RouterLink'
import { generatePath } from 'react-router'
import { ROUTE_PROPOSAL } from '../../../routes/routes'
import { ProposalContentType } from '../../../proposals/proposal/ProposalContentTypeTabs'

const StyledParagraph = styled('p')(({ theme }) => ({
    marginTop: 0,
    marginBottom: '24px',
    width: '75%',
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '8px',
    backgroundColor: theme.palette.primary.light,
    padding: '11px 20px',
}))
interface OwnProps {
    proposalIndex: number
}
export type AlreadyTurnedIntoProposal = OwnProps
const AlreadyTurnedIntoProposal = ({ proposalIndex }: AlreadyTurnedIntoProposal) => {
    const to = generatePath(`${ROUTE_PROPOSAL}/${ProposalContentType.Discussion}`, { proposalIndex })
    return (
        <StyledParagraph>
            {
                <Trans
                    id="discussion-already-proposal"
                    i18nKey="discussion.ideaAlreadyTurnedIntoProposal"
                    components={{ a: <RouterLink to={to} replace={true} /> }}
                />
            }
        </StyledParagraph>
    )
}
export default AlreadyTurnedIntoProposal
