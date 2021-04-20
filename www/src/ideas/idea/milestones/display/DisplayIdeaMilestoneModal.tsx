import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {DisplayIdeaMilestone} from "./DisplayIdeaMilestone";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";
import {useTranslation} from "react-i18next";

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
}

export const DisplayIdeaMilestoneModal = ({ idea, ideaMilestone, handleCloseModal }: Props) => {

    const { t } = useTranslation()

    return (
        <Modal
            open={true}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            maxWidth={'md'}
        >
            <>
                <h2 id='modal-title'>
                    {t('idea.milestones.modal.milestone')} - <b>{ideaMilestone.ordinalNumber}</b>
                </h2>
                <DisplayIdeaMilestone
                    idea={idea}
                    ideaMilestone={ideaMilestone}
                    handleCloseModal={handleCloseModal}
                />
            </>
        </Modal>
    )
}
