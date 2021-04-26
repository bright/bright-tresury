import React, {useState} from 'react'
import {IdeaMilestoneForm, IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";
import {
    IdeaMilestoneDto, patchIdeaMilestone,
    PatchIdeaMilestoneDto
} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
    handleSuccessfulFormSubmit: () => void
}

export const EditIdeaMilestone = ({ idea, ideaMilestone, handleCloseModal, handleSuccessfulFormSubmit }: Props) => {

    const { t } = useTranslation()

    const [showApiCallError, setShowApiCallError] = useState<boolean>(false)

    const submit = ({ subject, dateFrom, dateTo, description, networks }: IdeaMilestoneFormValues) => {
        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
            subject,
            dateFrom,
            dateTo,
            description,
            networks
        }
        patchIdeaMilestone(idea.id, ideaMilestone.id, patchIdeaMilestoneDto)
            .then(() => {
                handleSuccessfulFormSubmit()
            })
            .catch(() => setShowApiCallError(true))
    }

    return (
        <>
            <IdeaMilestoneForm
                idea={idea}
                ideaMilestone={ideaMilestone}
                readonly={false}
                onSubmit={submit}
            >
                <Button type='button' color='primary' variant='text' onClick={handleCloseModal}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </Button>
                <Button type='submit' color='primary'>
                    {t('idea.milestones.modal.form.buttons.save')}
                </Button>
            </IdeaMilestoneForm>
            <Snackbar open={showApiCallError} autoHideDuration={5000} onClose={() => setShowApiCallError(false)}>
                <Alert onClose={() => setShowApiCallError(false)} severity="error">
                    {t('idea.milestones.modal.form.apiCallErrorMessage')}
                </Alert>
            </Snackbar>
        </>

    )
}