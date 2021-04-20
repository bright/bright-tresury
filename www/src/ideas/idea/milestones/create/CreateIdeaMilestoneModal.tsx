import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {CreateIdeaMilestone} from "./CreateIdeaMilestone";
import {IdeaDto} from "../../../ideas.api";
import {useTranslation} from "react-i18next";

interface Props {
    idea: IdeaDto
    handleCloseModal: () => void
    fetchIdeaMilestones: () => Promise<void>
}

export const CreateIdeaMilestoneModal = ({ idea, handleCloseModal, fetchIdeaMilestones }: Props) => {

    const { t } = useTranslation()

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
            <>
                <h2 id='modal-title'>
                    {t('idea.milestones.modal.createMilestone')}
                </h2>
                <CreateIdeaMilestone
                    idea={idea}
                    handleCloseModal={handleCloseModal}
                    handleSuccessfulFormSubmit={handleSuccessfulFormSubmit}
                />
            </>
        </Modal>
    )
}
