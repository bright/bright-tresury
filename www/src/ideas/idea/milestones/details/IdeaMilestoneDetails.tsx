import React from 'react'
import { IdeaMilestoneForm } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../../components/button/Button'
import { IdeaMilestoneDto } from '../idea.milestones.api'
import { IdeaDto } from '../../../ideas.api'
import { useIdeaMilestoneFormFooterStyles } from '../form/footer/useIdeaMilestoneFormFooterStyles'

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onCancel: () => void
}

export const IdeaMilestoneDetails = ({ idea, ideaMilestone, onCancel }: Props) => {
    const { t } = useTranslation()

    const formFooterClasses = useIdeaMilestoneFormFooterStyles()

    return (
        <IdeaMilestoneForm idea={idea} ideaMilestone={ideaMilestone} readonly={true}>
            <div className={`${formFooterClasses.rootBase} ${formFooterClasses.rootHorizontalToVertical}`}>
                <div className={formFooterClasses.leftButtonWrapper}>
                    <Button type="button" color="primary" variant="text" onClick={onCancel}>
                        {t('idea.milestones.modal.form.buttons.cancel')}
                    </Button>
                </div>
            </div>
        </IdeaMilestoneForm>
    )
}
