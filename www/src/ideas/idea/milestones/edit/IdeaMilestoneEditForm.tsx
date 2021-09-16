import React from 'react'
import IdeaMilestoneForm, { IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { useTranslation } from 'react-i18next'
import { IDEA_MILESTONES_QUERY_KEY_BASE, usePatchIdeaMilestone } from '../idea.milestones.api'
import { IdeaDto } from '../../../ideas.dto'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import FormFooterErrorBox from '../../../../components/form/footer/FormFooterErrorBox'
import { IdeaMilestoneDto, PatchIdeaMilestoneDto } from '../idea.milestones.dto'
import { useQueryClient } from 'react-query'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'

interface OwnProps {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
}

export type IdeaMilestoneEditProps = OwnProps

const IdeaMilestoneEditForm = ({ idea, ideaMilestone, onClose }: IdeaMilestoneEditProps) => {
    const { t } = useTranslation()

    const queryClient = useQueryClient()

    const { mutateAsync, isError } = usePatchIdeaMilestone()

    const submit = async (ideaMilestoneFromValues: IdeaMilestoneFormValues) => {
        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
            ...ideaMilestone,
            ...ideaMilestoneFromValues,
        }

        await mutateAsync(
            { ideaId: idea.id, ideaMilestoneId: ideaMilestone.id, data: patchIdeaMilestoneDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_MILESTONES_QUERY_KEY_BASE, idea.id])
                    onClose()
                },
            },
        )
    }

    return (
        <IdeaMilestoneForm idea={idea} ideaMilestone={ideaMilestone} readonly={false} onSubmit={submit}>
            {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}

            <FormFooterButtonsContainer>
                <FormFooterButton type={'submit'} variant={'contained'}>
                    {t('idea.milestones.modal.form.buttons.save')}
                </FormFooterButton>

                <FormFooterButton type={'button'} variant={'text'} onClick={onClose}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </FormFooterButton>
            </FormFooterButtonsContainer>
        </IdeaMilestoneForm>
    )
}

export default IdeaMilestoneEditForm
