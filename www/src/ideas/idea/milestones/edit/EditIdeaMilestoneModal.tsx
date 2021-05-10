import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {EditIdeaMilestone} from "./EditIdeaMilestone";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";
import {useTranslation} from "react-i18next";
import {IdeaMilestoneModalHeader} from "../components/IdeaMilestoneModalHeader";
import { useTurnIdeaMilestoneIntoProposal } from '../turnIntoProposal/useTurnIdeaMilestoneIntoProposal'
import { Button } from '../../../../components/button/Button'

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onTurnIntoProposalClick: (ideaMilestone: IdeaMilestoneDto) => void
    fetchIdeaMilestones: () => Promise<void>
}

export const EditIdeaMilestoneModal = (
    { open, idea, ideaMilestone, onClose, onTurnIntoProposalClick, fetchIdeaMilestones }: Props
) => {

    const { t } = useTranslation()

    const {
        canTurnIntoProposal
    } = useTurnIdeaMilestoneIntoProposal(idea, ideaMilestone)

    const handleOnSuccessfulEdit = () => {
        onClose()
        fetchIdeaMilestones()
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            fullWidth={true}
            maxWidth={'md'}
        >
            <>
                <IdeaMilestoneModalHeader>
                    <h2 id='modal-title'>
                        { t('idea.milestones.modal.editMilestone') }
                    </h2>
                    { canTurnIntoProposal
                        ? (
                            <Button
                                color="primary"
                                onClick={() => onTurnIntoProposalClick(ideaMilestone)}
                            >
                                { t('idea.details.header.turnIntoProposal') }
                            </Button>
                        )
                        : null
                    }
                </IdeaMilestoneModalHeader>
                <EditIdeaMilestone
                    idea={idea}
                    ideaMilestone={ideaMilestone}
                    onCancel={onClose}
                    onSuccess={handleOnSuccessfulEdit}
                />
            </>
        </Modal>
    )
}
