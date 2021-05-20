import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthContext'
import Container from '../../../components/form/Container'
import IdeaForm from '../../form/IdeaForm'
import { TurnIdeaIntoProposalDto, useGetIdea, usePatchIdea, useTurnIdeaIntoProposal } from '../../ideas.api'
import { ExtrinsicDetails, SubmitProposalModal } from '../../SubmitProposalModal'
import { FormFooterButton } from '../../../components/form/footer/FormFooterButton'
import { useModal } from '../../../components/modal/useModal'
import { IdeaDto, IdeaStatus } from '../../ideas.dto'
import { useQueryClient } from 'react-query'
import { FormFooterErrorBox } from '../../../components/form/footer/FormFooterErrorBox'
import { FormFooterButtonsContainer } from '../../../components/form/footer/FormFooterButtonsContainer'

export const TurnIdeaIntoProposal = () => {
    const { t } = useTranslation()

    const history = useHistory()

    const submitProposalModal = useModal()

    const { isUserVerified, user } = useAuth()

    let { ideaId } = useParams<{ ideaId: string }>()

    const queryClient = useQueryClient()

    const { data: idea } = useGetIdea(ideaId)

    const { mutateAsync: patchMutateAsync, isError } = usePatchIdea()

    const { mutateAsync: turnMutateAsync } = useTurnIdeaIntoProposal()

    const canTurnIntoProposal = useMemo(
        () =>
            idea &&
            (idea.status === IdeaStatus.Draft || idea.status === IdeaStatus.Active) &&
            isUserVerified &&
            user?.id === idea.ownerId,
        [idea, isUserVerified, user],
    )

    const submit = async (formIdea: IdeaDto) => {
        const editedIdea = { ...idea, ...formIdea }

        await patchMutateAsync(editedIdea, {
            onSuccess: (patchedIdea) => {
                queryClient.setQueryData(['idea', idea!.id], patchedIdea)
                submitProposalModal.open()
            },
        })
    }

    const onTurn = useCallback(
        async (extrinsicDetails: ExtrinsicDetails) => {
            if (idea) {
                const turnIdeaIntoProposalDto: TurnIdeaIntoProposalDto = {
                    ideaNetworkId: idea.networks[0].id!,
                    extrinsicHash: extrinsicDetails.lastBlockHash,
                    lastBlockHash: extrinsicDetails.lastBlockHash,
                }
                await turnMutateAsync({ ideaId: idea.id!, data: turnIdeaIntoProposalDto })
            }
        },
        [idea],
    )

    return canTurnIntoProposal ? (
        <Container title={t('idea.turnIntoProposal.title')}>
            {idea && (
                <>
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
                    <SubmitProposalModal
                        open={submitProposalModal.visible}
                        onClose={submitProposalModal.close}
                        onTurn={onTurn}
                        title={t('idea.details.submitProposalModal.title')}
                        value={idea.networks[0].value}
                        beneficiary={idea.beneficiary}
                    />
                </>
            )}
        </Container>
    ) : (
        <Container title={t('idea.turnIntoProposal.cannotTurnError')} />
    )
}
