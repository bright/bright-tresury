import React from 'react'
import { IdeaMilestoneForm, IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../../components/button/Button'
import { IdeaMilestoneDto, patchIdeaMilestone, PatchIdeaMilestoneDto } from '../idea.milestones.api'
import { IdeaDto } from '../../../ideas.api'
import { ErrorType, useError } from '../../../../components/error/useError'
import { ErrorMessageModalBox } from '../../../../components/error/ErrorMessageModalBox'
import { useIdeaMilestoneFormFooterStyles } from '../form/footer/useIdeaMilestoneFormFooterStyles'

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onCancel: () => void
    onSuccess: () => void
}

export const IdeaMilestoneEdit = ({ idea, ideaMilestone, onCancel, onSuccess }: Props) => {
    const { t } = useTranslation()

    const formFooterClasses = useIdeaMilestoneFormFooterStyles()

    const { error, setError } = useError()

    const submit = (ideaMilestoneFromValues: IdeaMilestoneFormValues) => {
        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
            ...ideaMilestone,
            ...ideaMilestoneFromValues,
        }

        patchIdeaMilestone(idea.id, ideaMilestone.id, patchIdeaMilestoneDto)
            .then(() => {
                onSuccess()
            })
            .catch((err: ErrorType) => {
                setError(err)
                throw err
            })
    }

    return (
        <IdeaMilestoneForm idea={idea} ideaMilestone={ideaMilestone} readonly={false} onSubmit={submit}>
            <div className={`${formFooterClasses.rootBase} ${formFooterClasses.rootHorizontalToVertical}`}>
                <div className={formFooterClasses.leftButtonWrapper}>
                    <Button type="button" color="primary" variant="text" onClick={onCancel}>
                        {t('idea.milestones.modal.form.buttons.cancel')}
                    </Button>
                </div>

                <div>{error ? <ErrorMessageModalBox message={t('errors.somethingWentWrong')} /> : null}</div>

                <div className={formFooterClasses.rightButtonWrapper}>
                    <Button type="submit" color="primary">
                        {t('idea.milestones.modal.form.buttons.save')}
                    </Button>
                </div>
            </div>
        </IdeaMilestoneForm>
    )
}
