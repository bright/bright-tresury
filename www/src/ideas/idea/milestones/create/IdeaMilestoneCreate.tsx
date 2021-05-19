import React from 'react'
import { IdeaMilestoneForm, IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { LeftButton, RightButton } from '../../../../components/form/footer/buttons/Buttons'
import { Footer } from '../../../../components/form/footer/Footer'
import { ErrorBox } from '../../../../components/form/footer/errorBox/ErrorBox'
import { IdeaDto } from '../../../ideas.dto'
import { useCreateIdeaMilestone } from '../idea.milestones.api'
import { CreateIdeaMilestoneDto } from '../idea.milestones.dto'
import { useQueryClient } from 'react-query'

interface Props {
    idea: IdeaDto
    onCancel: () => void
    onSuccess: () => void
}

export const IdeaMilestoneCreate = ({ idea, onCancel, onSuccess }: Props) => {
    const { t } = useTranslation()

    const { mutateAsync, isError } = useCreateIdeaMilestone()

    const queryClient = useQueryClient()

    const submit = async (ideaMilestoneFormValues: IdeaMilestoneFormValues) => {
        const createIdeaMilestoneDto: CreateIdeaMilestoneDto = {
            ...ideaMilestoneFormValues,
        }

        await mutateAsync(
            { ideaId: idea.id, data: createIdeaMilestoneDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries(['ideaMilestones', idea.id])
                    onSuccess()
                },
            },
        )
    }

    return (
        <>
            <IdeaMilestoneForm idea={idea} readonly={false} onSubmit={submit}>
                <Footer>
                    <LeftButton type="button" variant="text" onClick={onCancel}>
                        {t('idea.milestones.modal.form.buttons.cancel')}
                    </LeftButton>
                    <div>{isError ? <ErrorBox error={t('errors.somethingWentWrong')} /> : null}</div>
                    <RightButton>{t('idea.milestones.modal.form.buttons.create')}</RightButton>
                </Footer>
            </IdeaMilestoneForm>
        </>
    )
}
