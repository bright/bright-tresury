import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { MilestoneModalHeader } from '../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import Button from '../../../../components/button/Button'
import { useIdeaMilestone } from '../useIdeaMilestone'

interface OwnProps {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onTurnIntoProposalClick: (ideaMilestone: IdeaMilestoneDto) => void
}
export type IdeaMilestoneContainerProps = PropsWithChildren<OwnProps>

export const IdeaMilestoneContainer = ({
    idea,
    ideaMilestone,
    onTurnIntoProposalClick,
    children,
}: IdeaMilestoneContainerProps) => {
    const { t } = useTranslation()
    const { canEdit, canTurnIntoProposal } = useIdeaMilestone(ideaMilestone, idea)
    const title = t(canEdit ? 'idea.milestones.modal.editMilestone' : 'idea.milestones.modal.milestone')
    return (
        <>
            <MilestoneModalHeader>
                <h2 id="modal-title">
                    {title} - <b>{ideaMilestone.ordinalNumber}</b>
                </h2>
                {canTurnIntoProposal ? (
                    <Button color="primary" onClick={() => onTurnIntoProposalClick(ideaMilestone)}>
                        {t('idea.details.header.turnIntoProposal')}
                    </Button>
                ) : null}
            </MilestoneModalHeader>
            {children}
        </>
    )
}
