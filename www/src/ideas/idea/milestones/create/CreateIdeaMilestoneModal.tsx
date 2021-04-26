import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {CreateIdeaMilestone} from "./CreateIdeaMilestone";
import {IdeaDto} from "../../../ideas.api";
import {useTranslation} from "react-i18next";
import {IdeaMilestoneModalHeader} from "../components/IdeaMilestoneModalHeader";

interface Props {
    open: boolean
    idea: IdeaDto
    handleCloseModal: () => void
    fetchIdeaMilestones: () => Promise<void>
}

export const CreateIdeaMilestoneModal = ({ open, idea, handleCloseModal, fetchIdeaMilestones }: Props) => {

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
                <IdeaMilestoneModalHeader>
                    <h2 id='modal-title'>
                        {t('idea.milestones.modal.createMilestone')}
                    </h2>
                </IdeaMilestoneModalHeader>
                <CreateIdeaMilestone
                    idea={idea}
                    handleCloseModal={handleCloseModal}
                    handleSuccessfulFormSubmit={handleSuccessfulFormSubmit}
                />
            </>
        </Modal>
    )
}
