import React from 'react'
import { IdeaMilestoneForm } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { IdeaDto } from '../../../ideas.dto'
import { FormFooterButton } from '../../../../components/form/footer/FormFooterButton'
import { FormFooterButtonsContainer } from '../../../../components/form/footer/FormFooterButtonsContainer'

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onCancel: () => void
}

export const IdeaMilestoneDetails = ({ idea, ideaMilestone, onCancel }: Props) => {
    const { t } = useTranslation()

    return (
        <IdeaMilestoneForm idea={idea} ideaMilestone={ideaMilestone} readonly={true}>
            <FormFooterButtonsContainer>
                <FormFooterButton type={'button'} variant={'text'} onClick={onCancel}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </FormFooterButton>
            </FormFooterButtonsContainer>
        </IdeaMilestoneForm>
    )
}
