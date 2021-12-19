import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import Container from '../../../components/form/Container'
import { useModal } from '../../../components/modal/useModal'
import { ROUTE_PROPOSALS } from '../../../routes/routes'
import { IdeaDto, IdeaStatus } from '../../ideas.dto'
import { useIdea } from '../useIdea'
import TurnIdeaIntoProposalForm from './TurnIdeaIntoProposalForm'
import TurnIdeaIntoProposalModal from './TurnIdeaIntoProposalModal'
import TurnPendingIdeaIntoProposalForm from './TurnPendingIdeaIntoProposalForm'

interface OwnProps {
    idea: IdeaDto
}

export type TurnIdeaIntoProposalProps = OwnProps

const TurnIdeaIntoProposal = ({ idea }: TurnIdeaIntoProposalProps) => {
    const { t } = useTranslation()
    const history = useHistory()

    const submitProposalModal = useModal()

    const { canTurnIntoProposal, isOwner } = useIdea(idea)

    if (!isOwner) {
        return <Container error={t('idea.turnIntoProposal.ideaBelongsToAnotherUser')} />
    }

    if (!canTurnIntoProposal) {
        history.push(ROUTE_PROPOSALS)
    }

    return (
        <Container title={t('idea.turnIntoProposal.title')} showWarningOnClose={true}>
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
