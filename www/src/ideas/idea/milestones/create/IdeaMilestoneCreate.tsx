import React from 'react'
import { IdeaMilestoneForm, IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { IdeaDto } from '../../../ideas.api'
import { createIdeaMilestone, CreateIdeaMilestoneDto } from '../idea.milestones.api'
import { ErrorType, useError } from '../../../../components/error/useError'
import { LeftButton, RightButton } from '../../../../components/form/buttons/Buttons'
import { Footer } from '../../../../components/form/footer/Footer'
import { ErrorBox } from '../../../../components/form/ErrorBox'

interface Props {
    idea: IdeaDto
    onCancel: () => void
    onSuccess: () => void
}

export const IdeaMilestoneCreate = ({ idea, onCancel, onSuccess }: Props) => {
    const { t } = useTranslation()

    const { error, setError } = useError()

    const submit = (ideaMilestoneFormValues: IdeaMilestoneFormValues) => {
        const createIdeaMilestoneDto: CreateIdeaMilestoneDto = {
            ...ideaMilestoneFormValues,
        }

        createIdeaMilestone(idea.id, createIdeaMilestoneDto)
            .then(() => {
                onSuccess()
            })
            .catch((err: ErrorType) => {
                setError(err)
                throw err
            })
    }

    return (
        <>
            <IdeaMilestoneForm idea={idea} readonly={false} onSubmit={submit}>
                <Footer>
                    <LeftButton type="button" variant="text" onClick={onCancel}>
                        {t('idea.milestones.modal.form.buttons.cancel')}
                    </LeftButton>
                    <div>{error ? <ErrorBox error={t('errors.somethingWentWrong')} /> : null}</div>
                    <RightButton>{t('idea.milestones.modal.form.buttons.create')}</RightButton>
                </Footer>
            </IdeaMilestoneForm>
        </>
    )
}
