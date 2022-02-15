import React from 'react'
import ActionButtons, { ActionButtonsProps } from '../../components/header/details/ActionButtons'
import { ProposalDto } from '../proposals.dto'
import ProposalPolkassemblyShareButton from './polkassembly/ProposalPolkassemblyShareButton'
import { useProposal } from './useProposals'
import { useTranslation } from 'react-i18next'
import EditButton from '../../components/header/details/EditButton'
import { generatePath, useHistory } from 'react-router-dom'
import { ROUTE_EDIT_PROPOSAL } from '../../routes/routes'
import PolkassemblyShareButton from '../../polkassembly/PolkassemblyShareButton'

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalActionButtonsProps = OwnProps & ActionButtonsProps

const ProposalActionButtons = ({ proposal, ...props }: ProposalActionButtonsProps) => {
    const { t } = useTranslation()
    const { canEdit } = useProposal(proposal)
    const history = useHistory()

    if (!canEdit) {
        return null
    }

    const navigateToEdit = () => {
        history.push(generatePath(ROUTE_EDIT_PROPOSAL, { proposalIndex: proposal.proposalIndex }))
    }

    return (
        <ActionButtons {...props}>
            <ProposalPolkassemblyShareButton proposal={proposal} />
            <EditButton
                label={proposal.details ? t('proposal.details.edit') : t('proposal.details.add')}
                onClick={navigateToEdit}
            />
        </ActionButtons>
    )
}

export default ProposalActionButtons
