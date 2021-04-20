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
    handleSuccessfulFormSubmit: () => void
}

export const EditIdeaMilestone = ({ idea, ideaMilestone, handleCloseModal, handleSuccessfulFormSubmit }: Props) => {

    const { t } = useTranslation()

    return (
        <IdeaMilestoneForm
            idea={idea}
            ideaMilestone={ideaMilestone}
            mode={IdeaMilestoneFormMode.Edit}
            onSuccessfulSubmit={handleSuccessfulFormSubmit}
        >
            <Button type='button' color='primary' variant='text' onClick={handleCloseModal}>
                {t('idea.milestones.modal.form.buttons.cancel')}
            </Button>
            <Button type='submit' color='primary'>
                {t('idea.milestones.modal.form.buttons.save')}
            </Button>
        </IdeaMilestoneForm>
    )
}