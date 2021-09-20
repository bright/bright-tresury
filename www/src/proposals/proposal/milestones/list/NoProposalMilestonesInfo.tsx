import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProposalDto } from '../../../proposals.dto'
import { useProposal } from '../../useProposals'

interface OwnProps {
    proposal: ProposalDto
}

export type NoProposalMilestonesInfoProps = OwnProps

const NoProposalMilestonesInfo = ({ proposal }: NoProposalMilestonesInfoProps) => {
    const { t } = useTranslation()
    const { canEdit, isEditable, canEditMilestones } = useProposal(proposal)

    if (!isEditable) {
        return <p>{t('proposal.milestones.noMilestones.noMilestones')}</p>
    }
    if (!canEdit) {
        return <p>{t('proposal.milestones.noMilestones.notOwner')}</p>
    }
    if (!canEditMilestones) {
        return <p>{t('proposal.milestones.noMilestones.noDetails')}</p>
    }
    return <p>{t('proposal.milestones.noMilestones.addMilestones')}</p>
}

export default NoProposalMilestonesInfo
