import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import Container from '../../../components/form/Container'
import { useModal } from '../../../components/modal/useModal'
import { useNetworks } from '../../../networks/useNetworks'
import { ROUTE_PROPOSALS } from '../../../routes/routes'
import { useGetIdea } from '../../ideas.api'
import { IdeaStatus } from '../../ideas.dto'
import { useIdea } from '../useIdea'
import TurnIdeaIntoProposalForm from './TurnIdeaIntoProposalForm'
import TurnIdeaIntoProposalModal from './TurnIdeaIntoProposalModal'
import TurnPendingIdeaIntoProposalForm from './TurnPendingIdeaIntoProposalForm'

const TurnIdeaIntoProposal = () => {
    const { t } = useTranslation()
    const history = useHistory()

    const submitProposalModal = useModal()

    const { ideaId } = useParams<{ ideaId: string }>()
    const { network } = useNetworks()
    const { data: idea } = useGetIdea({ ideaId, network: network.id }, { refetchOnWindowFocus: false })

    const { canTurnIntoProposal, isOwner } = useIdea(idea)

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
                    {idea.status === IdeaStatus.Pending ? (
                        <TurnPendingIdeaIntoProposalForm
                            idea={idea}
                            submitProposalModalOpen={submitProposalModal.open}
                        />
                    ) : (
                        <TurnIdeaIntoProposalForm idea={idea} submitProposalModalOpen={submitProposalModal.open} />
                    )}
                    <TurnIdeaIntoProposalModal
                        idea={idea}
                        open={submitProposalModal.visible}
                        onClose={submitProposalModal.close}
                    />
                </>
            ) : null}
        </Container>
    )
}

export default TurnIdeaIntoProposal
