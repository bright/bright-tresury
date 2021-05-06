import React, {useMemo} from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {EditIdeaMilestone} from "./EditIdeaMilestone";
import {IdeaMilestoneDto, IdeaMilestoneStatus} from "../idea.milestones.api";
import {IdeaDto, IdeaStatus} from "../../../ideas.api";
import {useTranslation} from "react-i18next";
import {IdeaMilestoneModalHeader} from "../components/IdeaMilestoneModalHeader";
import {Button} from "../../../../components/button/Button";

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
    handleTurnIdeaMilestoneIntoProposal: (ideaMilestone: IdeaMilestoneDto) => void
    fetchIdeaMilestones: () => Promise<void>
}

export const EditIdeaMilestoneModal = ({ open, idea, ideaMilestone, handleCloseModal, handleTurnIdeaMilestoneIntoProposal, fetchIdeaMilestones }: Props) => {

    const { t } = useTranslation()

    const handleSuccessfulFormSubmit = () => {
        handleCloseModal()
        fetchIdeaMilestones()
    }

    const canTurnIntoProposal = useMemo(() => {
        return idea.status !== IdeaStatus.TurnedIntoProposal && ideaMilestone.status !== IdeaMilestoneStatus.TurnedIntoProposal
    }, [idea.status, ideaMilestone.status])

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            maxWidth={'md'}
        >
            <>
                <IdeaMilestoneModalHeader>
                    <h2 id='modal-title'>
                        {t('idea.milestones.modal.editMilestone')}
                    </h2>
                    { canTurnIntoProposal
                        ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    handleCloseModal()
                                    handleTurnIdeaMilestoneIntoProposal(ideaMilestone)
                                }}>
                                {t('idea.details.header.turnIntoProposal')}
                            </Button>
                        )
                        : null
                    }
                </IdeaMilestoneModalHeader>
                <EditIdeaMilestone
                    idea={idea}
                    ideaMilestone={ideaMilestone}
                    handleCloseModal={handleCloseModal}
                    handleSuccessfulFormSubmit={handleSuccessfulFormSubmit}
                />
            </>
        </Modal>
    )
}
