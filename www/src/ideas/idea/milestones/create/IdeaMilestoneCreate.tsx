import React from 'react'
import {IdeaMilestoneForm, IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";
import {IdeaDto} from "../../../ideas.api";
import {createIdeaMilestone, CreateIdeaMilestoneDto} from "../idea.milestones.api";

interface Props {
    idea: IdeaDto
    onCancel: () => void
    onSuccess: () => void
}

export const IdeaMilestoneCreate = ({ idea, onCancel, onSuccess }: Props) => {

    const { t } = useTranslation()

    const submit = (ideaMilestoneFormValues: IdeaMilestoneFormValues) => {

        const createIdeaMilestoneDto: CreateIdeaMilestoneDto = {
          ...ideaMilestoneFormValues
        }

        createIdeaMilestone(idea.id, createIdeaMilestoneDto)
            .then(() => {
                onSuccess()
            })
            .catch((err) => {
                // TODO: Use common API calls error handler when it will be ready
                console.log(err)
            })
    }

    return (
        <>
            <IdeaMilestoneForm
                idea={idea}
                readonly={false}
                onSubmit={submit}
            >
                <Button type='button' color='primary' variant='text' onClick={onCancel}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </Button>
                <Button type='submit' color='primary'>
                    {t('idea.milestones.modal.form.buttons.create')}
                </Button>
            </IdeaMilestoneForm>
        </>
    )
}

