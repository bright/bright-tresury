import React from 'react'
import { IdeaMilestoneForm, IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../../components/button/Button'
import { IdeaDto } from '../../../ideas.api'
import { createIdeaMilestone, CreateIdeaMilestoneDto } from '../idea.milestones.api'
import { ErrorType, useError } from '../../../../components/error/useError'
import { ErrorMessageModalBox } from '../../../../components/error/ErrorMessageModalBox'
import { useIdeaMilestoneFormFooterStyles } from '../form/footer/useIdeaMilestoneFormFooterStyles'

interface Props {
    idea: IdeaDto
    onCancel: () => void
    onSuccess: () => void
}

export const IdeaMilestoneCreate = ({ idea, onCancel, onSuccess }: Props) => {
    const { t } = useTranslation()

    const formFooterClasses = useIdeaMilestoneFormFooterStyles()

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
                <div className={`${formFooterClasses.rootBase} ${formFooterClasses.rootHorizontalToVertical}`}>
                    <div className={formFooterClasses.leftButtonWrapper}>
                        <Button type="button" color="primary" variant="text" onClick={onCancel}>
                            {t('idea.milestones.modal.form.buttons.cancel')}
                        </Button>
                    </div>

                    <div>{error ? <ErrorMessageModalBox message={t('errors.somethingWentWrong')} /> : null}</div>

                    <div className={formFooterClasses.rightButtonWrapper}>
                        <Button type="submit" color="primary">
                            {t('idea.milestones.modal.form.buttons.create')}
                        </Button>
                    </div>
                </div>
            </IdeaMilestoneForm>
        </>
    )
}
