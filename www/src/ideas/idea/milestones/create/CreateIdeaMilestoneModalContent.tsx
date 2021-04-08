import React from 'react'
import {IdeaMilestoneForm, IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";

interface Props {
    formValues: IdeaMilestoneFormValues
    onCancel: () => void
    onSumbit: (ideaMilestone: IdeaMilestoneFormValues) => void
}

export const CreateIdeaMilestoneModalContent = ({ formValues, onCancel, onSumbit }: Props) => {

    const { t } = useTranslation()

    return (
        <>
            <h2 id='modal-title'>{t('idea.milestones.modal.createMilestone')}</h2>
            <IdeaMilestoneForm values={formValues} readonly={false} onSubmit={onSumbit}>
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