import React from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {DisplayIdeaMilestone} from "./DisplayIdeaMilestone";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";
import {useTranslation} from "react-i18next";
import {IdeaMilestoneModalHeader} from "../components/IdeaMilestoneModalHeader";

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
}

export const DisplayIdeaMilestoneModal = ({ open, idea, ideaMilestone, onClose }: Props) => {

    const { t } = useTranslation()

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
                        { t('idea.milestones.modal.milestone') } - <b>{ ideaMilestone.ordinalNumber }</b>
                    </h2>
                </IdeaMilestoneModalHeader>
                <DisplayIdeaMilestone
                    idea={idea}
                    ideaMilestone={ideaMilestone}
                    onCancel={onClose}
                />
            </>
        </Modal>
    )
}
