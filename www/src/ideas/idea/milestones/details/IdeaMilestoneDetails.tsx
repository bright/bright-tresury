import React from 'react'
import { IdeaMilestoneForm } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { IdeaMilestoneDto } from '../idea.milestones.api'
import { IdeaDto } from '../../../ideas.api'
import { Footer } from '../../../../components/form/footer/Footer'
import { LeftButton } from '../../../../components/form/buttons/Buttons'

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onCancel: () => void
}

export const IdeaMilestoneDetails = ({ idea, ideaMilestone, onCancel }: Props) => {
    const { t } = useTranslation()

    return (
        <IdeaMilestoneForm idea={idea} ideaMilestone={ideaMilestone} readonly={true}>
            <Footer>
                <LeftButton type="button" variant="text" onClick={onCancel}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </LeftButton>
            </Footer>
        </IdeaMilestoneForm>
    )
}
