import React from 'react'
import { IdeaMilestoneForm, IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { usePatchIdeaMilestone } from '../idea.milestones.api'
import { IdeaDto } from '../../../ideas.dto'
import { Footer } from '../../../../components/form/footer/Footer'
import { LeftButton, RightButton } from '../../../../components/form/footer/buttons/Buttons'
import { ErrorBox } from '../../../../components/form/footer/errorBox/ErrorBox'
import { IdeaMilestoneDto, PatchIdeaMilestoneDto } from '../idea.milestones.dto'
import { useQueryClient } from 'react-query'

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onCancel: () => void
    onSuccess: () => void
}

export const IdeaMilestoneEdit = ({ idea, ideaMilestone, onCancel, onSuccess }: Props) => {
    const { t } = useTranslation()

    const queryClient = useQueryClient()

    const { mutateAsync, isError } = usePatchIdeaMilestone()

    const submit = async (ideaMilestoneFromValues: IdeaMilestoneFormValues) => {
        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
            ...ideaMilestone,
            ...ideaMilestoneFromValues,
        }

        await mutateAsync(
            { ideaId: idea.id, ideaMilestoneId: idea.id, data: patchIdeaMilestoneDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries(['ideaMilestones', idea.id])
                    onSuccess()
                },
            },
        )
    }

    return (
        <IdeaMilestoneForm idea={idea} ideaMilestone={ideaMilestone} readonly={false} onSubmit={submit}>
            <Footer>
                <LeftButton type="button" variant="text" onClick={onCancel}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </LeftButton>
                <div>{isError ? <ErrorBox error={t('errors.somethingWentWrong')} /> : null}</div>
                <RightButton>{t('idea.milestones.modal.form.buttons.save')}</RightButton>
            </Footer>
        </IdeaMilestoneForm>
    )
}
