import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../components/form/footer/FormFooterErrorBox'
import IdeaForm from '../../form/IdeaForm'
import { IDEA_QUERY_KEY_BASE, usePatchIdea } from '../../ideas.api'
import { EditIdeaDto, IdeaDto } from '../../ideas.dto'

interface OwnProps {
    idea: IdeaDto
    submitProposalModalOpen: () => void
}

export type TurnIdeaIntoProposalFormProps = OwnProps

const TurnIdeaIntoProposalForm = ({ idea, submitProposalModalOpen }: TurnIdeaIntoProposalFormProps) => {
    const { t } = useTranslation()

    const history = useHistory()

    const queryClient = useQueryClient()

    const { mutateAsync: patchMutateAsync, isError } = usePatchIdea()

    const submit = async (formIdea: EditIdeaDto) => {
        const editedIdea = { id: idea?.id, ...formIdea }

        await patchMutateAsync(editedIdea, {
            onSuccess: (patchedIdea) => {
                queryClient.setQueryData([IDEA_QUERY_KEY_BASE, idea!.id], patchedIdea)
                submitProposalModalOpen()
            },
        })
    }

    return (
        <IdeaForm idea={idea} onSubmit={submit} extendedValidation={true} foldable={true}>
            {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}

            <FormFooterButtonsContainer>
                <FormFooterButton type={'submit'} variant={'contained'}>
                    {t('idea.turnIntoProposal.submit')}
                </FormFooterButton>

                <FormFooterButton type={'button'} variant={'outlined'} onClick={history.goBack}>
                    {t('idea.turnIntoProposal.cancel')}
                </FormFooterButton>
            </FormFooterButtonsContainer>
        </IdeaForm>
    )
}

export default TurnIdeaIntoProposalForm
