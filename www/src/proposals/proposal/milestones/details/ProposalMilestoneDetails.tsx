import React from 'react'
import { useTranslation } from 'react-i18next'
import { MilestoneModalHeader } from '../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'
import { ProposalMilestoneDto } from '../proposal.milestones.dto'

interface OwnProps {
    milestone: ProposalMilestoneDto
    onCancel: () => void
}

export type IdeaMilestoneDetailsProps = OwnProps

const ProposalMilestoneDetails = ({ milestone, onCancel }: IdeaMilestoneDetailsProps) => {
    const { t } = useTranslation()

    return (
        <div>
            <MilestoneModalHeader>
                <h2 id="modal-title">
                    {t('idea.milestones.modal.milestone')} - <b>{milestone.ordinalNumber}</b>
                </h2>
            </MilestoneModalHeader>
        </div>
        // TODO
        // <IdeaMilestoneForm idea={idea} ideaMilestone={ideaMilestone} readonly={true}>
        //     <FormFooterButtonsContainer>
        //         <FormFooterButton type={'button'} variant={'text'} onClick={onCancel}>
        //             {t('idea.milestones.modal.form.buttons.cancel')}
        //         </FormFooterButton>
        //     </FormFooterButtonsContainer>
        // </IdeaMilestoneForm>
    )
}

export default ProposalMilestoneDetails
