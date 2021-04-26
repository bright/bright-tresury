import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {EditIdeaMilestone} from "./EditIdeaMilestone";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";
import {useTranslation} from "react-i18next";

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
    fetchIdeaMilestones: () => Promise<void>
}

export const EditIdeaMilestoneModal = ({ open, idea, ideaMilestone, handleCloseModal, fetchIdeaMilestones }: Props) => {

    const { t } = useTranslation()

    const handleSuccessfulFormSubmit = () => {
        handleCloseModal()
        fetchIdeaMilestones()
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            maxWidth={'md'}
        >
            <>
                <h2 id='modal-title'>
                    {t('idea.milestones.modal.editMilestone')}
                </h2>
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
