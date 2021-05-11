import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {CreateIdeaMilestone} from "./CreateIdeaMilestone";
import {IdeaDto} from "../../../ideas.api";
import {useTranslation} from "react-i18next";
import {IdeaMilestoneModalHeader} from "../components/IdeaMilestoneModalHeader";

interface Props {
    open: boolean
    idea: IdeaDto
    onClose: () => void
    fetchIdeaMilestones: () => Promise<void>
}

export const CreateIdeaMilestoneModal = ({ open, idea, onClose, fetchIdeaMilestones }: Props) => {

    const { t } = useTranslation()

    const onSuccess = () => {
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
                        { t('idea.milestones.modal.createMilestone') }
                    </h2>
                </IdeaMilestoneModalHeader>
                <CreateIdeaMilestone
                    idea={idea}
                    onCancel={onClose}
                    onSuccess={onSuccess}
                />
            </>
        </Modal>
    )
}
