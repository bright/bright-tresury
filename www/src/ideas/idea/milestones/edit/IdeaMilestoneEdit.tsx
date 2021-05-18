import React from 'react'
import { IdeaMilestoneForm, IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { IdeaMilestoneDto, patchIdeaMilestone, PatchIdeaMilestoneDto } from '../idea.milestones.api'
import { IdeaDto } from '../../../ideas.api'
import { ErrorType, useError } from '../../../../components/error/useError'
import { Footer } from '../../../../components/form/footer/Footer'
import { LeftButton, RightButton } from '../../../../components/form/buttons/Buttons'
import { ErrorBox } from '../../../../components/form/ErrorBox'

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onCancel: () => void
    onSuccess: () => void
}

export const IdeaMilestoneEdit = ({ idea, ideaMilestone, onCancel, onSuccess }: Props) => {
    const { t } = useTranslation()

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
            <Footer>
                <LeftButton type="button" variant="text" onClick={onCancel}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </LeftButton>
                <div>{error ? <ErrorBox error={t('errors.somethingWentWrong')} /> : null}</div>
                <RightButton>{t('idea.milestones.modal.form.buttons.save')}</RightButton>
            </Footer>
        </IdeaMilestoneForm>
    )
}
