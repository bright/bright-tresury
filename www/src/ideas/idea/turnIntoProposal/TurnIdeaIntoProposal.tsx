import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthContext'
import Container from '../../../components/form/Container'
import { useNetworks } from '../../../networks/useNetworks'
import IdeaForm from '../../form/IdeaForm'
import { IDEA_QUERY_KEY_BASE, useGetIdea, usePatchIdea, useTurnIdeaIntoProposal } from '../../ideas.api'
import SubmitProposalModal, { ExtrinsicDetails } from '../../SubmitProposalModal'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import { useModal } from '../../../components/modal/useModal'
import { IdeaDto, IdeaStatus, TurnIdeaIntoProposalDto } from '../../ideas.dto'
import { useQueryClient } from 'react-query'
import FormFooterErrorBox from '../../../components/form/footer/FormFooterErrorBox'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'

const TurnIdeaIntoProposal = () => {
    const { t } = useTranslation()

    const history = useHistory()

    const submitProposalModal = useModal()

    let { ideaId } = useParams<{ ideaId: string }>()

    const queryClient = useQueryClient()

    const { user } = useAuth()

    const { data: idea } = useGetIdea(ideaId)

    const { mutateAsync: patchMutateAsync, isError } = usePatchIdea()

    const { mutateAsync: turnMutateAsync } = useTurnIdeaIntoProposal()

    const ideaAlreadyTurnedIntoProposal = useMemo(() => {
        return idea && [IdeaStatus.TurnedIntoProposal, IdeaStatus.TurnedIntoProposalByMilestone].includes(idea.status)
    }, [idea])

    const ideaBelongsToAnotherUser = useMemo(() => {
        return idea?.ownerId !== user?.id
    }, [idea, user])

    const submit = async (formIdea: IdeaDto) => {
        const editedIdea = { ...idea, ...formIdea }

        await patchMutateAsync(editedIdea, {
            onSuccess: (patchedIdea) => {
                queryClient.setQueryData([IDEA_QUERY_KEY_BASE, idea!.id], patchedIdea)
                submitProposalModal.open()
            },
        })
    }

    const { network } = useNetworks()
    const ideaNetwork = idea?.networks.find((n) => n.name === network.id)

    const onTurn = useCallback(
        async ({ extrinsicHash, lastBlockHash }: ExtrinsicDetails) => {
            if (idea && ideaNetwork) {
                const turnIdeaIntoProposalDto: TurnIdeaIntoProposalDto = {
                    ideaNetworkId: ideaNetwork.id!,
                    extrinsicHash,
                    lastBlockHash,
                }
                await turnMutateAsync({ ideaId: idea.id!, data: turnIdeaIntoProposalDto })
            }
        },
        [idea, turnMutateAsync],
    )

    if (ideaAlreadyTurnedIntoProposal) {
        return <Container title={t('idea.turnIntoProposal.ideaIsAlreadyConvertedIntoProposal')} />
    }

    if (ideaBelongsToAnotherUser) {
        return <Container title={t('idea.turnIntoProposal.ideaBelongsToAnotherUser')} />
    }

    if (!ideaNetwork) {
        return <Container title={t('idea.turnIntoProposal.noIdeaNetworkForCurrentNetwork')} />
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
                        value={ideaNetwork.value}
                        beneficiary={idea.beneficiary}
                    />
                </>
            ) : null}
        </Container>
    )
}

export default TurnIdeaIntoProposal
