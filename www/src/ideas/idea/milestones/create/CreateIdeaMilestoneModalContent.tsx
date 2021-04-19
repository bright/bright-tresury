import React from 'react'
import {IdeaMilestoneForm, IdeaMilestoneFormMode} from "../form/IdeaMilestoneForm";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";
import {IdeaDto} from "../../../ideas.api";

interface Props {
    idea: IdeaDto
    handleCloseModal: () => void
    handleSuccessfulFormSubmit: () => void
}

export const CreateIdeaMilestoneModalContent = ({ idea, handleCloseModal, handleSuccessfulFormSubmit }: Props) => {

    const { t } = useTranslation()

    return (
        <>
            <h2 id='modal-title'>
                {t('idea.milestones.modal.createMilestone')}
            </h2>
            <IdeaMilestoneForm
                idea={idea}
                mode={IdeaMilestoneFormMode.Create}
                onSuccessfulSubmit={handleSuccessfulFormSubmit}
            >
                <Button type='button' color='primary' variant='text' onClick={handleCloseModal}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </Button>
                <Button type='submit' color='primary'>
                    {t('idea.milestones.modal.form.buttons.create')}
                </Button>
            </IdeaMilestoneForm>
        </>
    )
}