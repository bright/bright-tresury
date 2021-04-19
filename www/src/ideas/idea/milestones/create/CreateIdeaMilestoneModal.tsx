import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {CreateIdeaMilestoneModalContent} from "./CreateIdeaMilestoneModalContent";
import {IdeaDto} from "../../../ideas.api";

interface Props {
    idea: IdeaDto
    handleCloseModal: () => void
    fetchIdeaMilestones: () => Promise<void>
}

export const CreateIdeaMilestoneModal = ({ idea, handleCloseModal, fetchIdeaMilestones }: Props) => {

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
            <CreateIdeaMilestoneModalContent
                idea={idea}
                handleCloseModal={handleCloseModal}
                handleSuccessfulFormSubmit={handleSuccessfulFormSubmit}
            />
        </Modal>
    )
}
