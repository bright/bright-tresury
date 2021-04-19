import React from 'react'
import {IdeaMilestoneForm, IdeaMilestoneFormMode} from "../form/IdeaMilestoneForm";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
}

export const DisplayIdeaMilestoneModalContent = ({ idea, ideaMilestone, handleCloseModal }: Props) => {

    const { t } = useTranslation()

    return (
        <>
            <h2 id='modal-title'>
                {t('idea.milestones.modal.milestone')} - <b>{ideaMilestone.ordinalNumber}</b>
            </h2>
            <IdeaMilestoneForm
                idea={idea}
                ideaMilestone={ideaMilestone}
                mode={IdeaMilestoneFormMode.Display}
            >
                <Button type='button' color='primary' variant='text' onClick={handleCloseModal}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </Button>
            </IdeaMilestoneForm>
        </>
    )
}