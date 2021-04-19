import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {EditIdeaMilestoneModalContent} from "./EditIdeaMilestoneModalContent";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
    fetchIdeaMilestones: () => Promise<void>
}

export const EditIdeaMilestoneModal = ({ idea, ideaMilestone, handleCloseModal, fetchIdeaMilestones }: Props) => {

    const handleSuccessfulFormSubmit = () => {
        handleCloseModal()
        fetchIdeaMilestones()
    }

    return (
        <Modal
            open={true}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            maxWidth={'md'}
        >
            <EditIdeaMilestoneModalContent
                idea={idea}
                ideaMilestone={ideaMilestone}
                handleCloseModal={handleCloseModal}
                handleSuccessfulFormSubmit={handleSuccessfulFormSubmit}
            />
        </Modal>
    )
}
