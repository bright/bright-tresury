import React from 'react'
import {IdeaMilestoneForm, IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";

interface Props {
    ideaMilestoneOrdinalNumber: number
    formValues: IdeaMilestoneFormValues
    onCancel: () => void
    onSumbit: (ideaMilestone: IdeaMilestoneFormValues) => void
}

export const DisplayIdeaMilestoneModalContent = ({ ideaMilestoneOrdinalNumber, formValues, onCancel, onSumbit }: Props) => {

    const { t } = useTranslation()

    return (
        <>
            <h2 id='modal-title'>
                {t('idea.milestones.modal.milestone')} - <b>{ideaMilestoneOrdinalNumber}</b>
            </h2>
            <IdeaMilestoneForm values={formValues} readonly={true} onSubmit={onSumbit}>
                <Button type='button' color='primary' variant='text' onClick={onCancel}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </Button>
            </IdeaMilestoneForm>
        </>
    )
}