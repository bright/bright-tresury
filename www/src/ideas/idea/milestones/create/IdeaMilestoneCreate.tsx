import React from 'react'
import { IdeaMilestoneForm, IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { FormFooterButton } from '../../../../components/form/footer/FormFooterButton'
import { FormFooterErrorBox } from '../../../../components/form/footer/FormFooterErrorBox'
import { IdeaDto } from '../../../ideas.dto'
import { IDEA_MILESTONES_QUERY_KEY_BASE, useCreateIdeaMilestone } from '../idea.milestones.api'
import { CreateIdeaMilestoneDto } from '../idea.milestones.dto'
import { useQueryClient } from 'react-query'
import { FormFooterButtonsContainer } from '../../../../components/form/footer/FormFooterButtonsContainer'

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
                    await queryClient.refetchQueries([IDEA_MILESTONES_QUERY_KEY_BASE, idea.id])
                    onSuccess()
                },
            },
        )
    }

    return (
        <>
            <IdeaMilestoneForm idea={idea} readonly={false} onSubmit={submit}>
                {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}

                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'} variant={'contained'}>
                        {t('idea.milestones.modal.form.buttons.create')}
                    </FormFooterButton>

                    <FormFooterButton type={'button'} variant={'text'} onClick={onCancel}>
                        {t('idea.milestones.modal.form.buttons.cancel')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            </IdeaMilestoneForm>
        </>
    )
}
