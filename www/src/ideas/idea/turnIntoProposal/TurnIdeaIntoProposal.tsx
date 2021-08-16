import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import Container from '../../../components/form/Container'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../components/form/footer/FormFooterErrorBox'
import { useModal } from '../../../components/modal/useModal'
import { useNetworks } from '../../../networks/useNetworks'
import { ROUTE_PROPOSALS } from '../../../routes/routes'
import IdeaForm from '../../form/IdeaForm'
import { IDEA_QUERY_KEY_BASE, useGetIdea, usePatchIdea, useTurnIdeaIntoProposal } from '../../ideas.api'
import { EditIdeaDto, TurnIdeaIntoProposalDto } from '../../ideas.dto'
import SubmitProposalModal, { ExtrinsicDetails } from '../../SubmitProposalModal'
import { useIdea } from '../useIdea'

const TurnIdeaIntoProposal = () => {
    const { t } = useTranslation()

    const history = useHistory()

    const submitProposalModal = useModal()

    let { ideaId } = useParams<{ ideaId: string }>()

    const queryClient = useQueryClient()

    const { network } = useNetworks()
    const { data: idea } = useGetIdea({ ideaId, network: network.id }, { refetchOnWindowFocus: false })

    const { mutateAsync: patchMutateAsync, isError } = usePatchIdea()

    const { mutateAsync: turnMutateAsync } = useTurnIdeaIntoProposal()

    const { canTurnIntoProposal, isOwner } = useIdea(idea?.id ?? '')

    const submit = async (formIdea: EditIdeaDto) => {
        const editedIdea = { id: idea?.id, ...formIdea }

        await patchMutateAsync(editedIdea, {
            onSuccess: (patchedIdea) => {
                queryClient.setQueryData([IDEA_QUERY_KEY_BASE, idea!.id], patchedIdea)
                submitProposalModal.open()
            },
        })
    }

    const onTurn = useCallback(
        async ({ extrinsicHash, lastBlockHash }: ExtrinsicDetails) => {
            if (idea) {
                const turnIdeaIntoProposalDto: TurnIdeaIntoProposalDto = {
                    ideaNetworkId: idea.currentNetwork.id,
                    extrinsicHash,
                    lastBlockHash,
                }
                await turnMutateAsync({ ideaId: idea.id!, data: turnIdeaIntoProposalDto })
            }
        },
        [idea, turnMutateAsync],
    )

    if (!isOwner) {
        return <Container title={t('idea.turnIntoProposal.ideaBelongsToAnotherUser')} />
    }

    if (!canTurnIntoProposal) {
        history.push(ROUTE_PROPOSALS)
    }

    return (
        <Container title={t('idea.turnIntoProposal.title')}>
            {idea ? (
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
                        value={idea.currentNetwork.value}
                        beneficiary={idea.beneficiary}
                    />
                </>
            ) : null}
        </Container>
    )
}

export default TurnIdeaIntoProposal
