import React from 'react'
import {IdeaMilestoneForm, IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";
import {
    IdeaMilestoneDto, patchIdeaMilestone,
    PatchIdeaMilestoneDto
} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onCancel: () => void
    onSuccess: () => void
}

export const IdeaMilestoneEdit = (
    { idea, ideaMilestone, onCancel, onSuccess }: Props
) => {

    const { t } = useTranslation()

    const submit = (ideaMilestoneFromValues: IdeaMilestoneFormValues) => {

        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
            ...ideaMilestone,
            ...ideaMilestoneFromValues
        }

        patchIdeaMilestone(idea.id, ideaMilestone.id, patchIdeaMilestoneDto)
            .then(() => {
                onSuccess()
            })
            .catch((err) => {
                // TODO: Use common API calls error handler when it will be ready
                console.log(err)
            })
    }

    return (
        <IdeaMilestoneForm
            idea={idea}
            ideaMilestone={ideaMilestone}
            readonly={false}
            onSubmit={submit}
        >
            <Button type='button' color='primary' variant='text' onClick={onCancel}>
                {t('idea.milestones.modal.form.buttons.cancel')}
            </Button>
            <Button type='submit' color='primary'>
                {t('idea.milestones.modal.form.buttons.save')}
            </Button>
        </IdeaMilestoneForm>
    )
}