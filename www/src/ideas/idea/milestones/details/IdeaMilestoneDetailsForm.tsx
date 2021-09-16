import React from 'react'
import IdeaMilestoneForm from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { IdeaDto } from '../../../ideas.dto'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'

interface OwnProps {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
}

export type IdeaMilestoneDetailsProps = OwnProps

const IdeaMilestoneDetailsForm = ({ idea, ideaMilestone, onClose }: IdeaMilestoneDetailsProps) => {
    const { t } = useTranslation()

    return (
        <IdeaMilestoneForm idea={idea} ideaMilestone={ideaMilestone} readonly={true}>
            <FormFooterButtonsContainer>
                <FormFooterButton type={'button'} variant={'text'} onClick={onClose}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </FormFooterButton>
            </FormFooterButtonsContainer>
        </IdeaMilestoneForm>
    )
}

export default IdeaMilestoneDetailsForm
