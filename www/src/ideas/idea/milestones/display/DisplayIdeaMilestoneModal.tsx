import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {DisplayIdeaMilestoneModalContent} from "./DisplayIdeaMilestoneModalContent";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
}

export const DisplayIdeaMilestoneModal = ({ idea, ideaMilestone, handleCloseModal }: Props) => {
    return (
        <Modal
            open={true}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            maxWidth={'md'}
        >
            <DisplayIdeaMilestoneModalContent
                idea={idea}
                ideaMilestone={ideaMilestone}
                handleCloseModal={handleCloseModal}
            />
        </Modal>
    )
}
