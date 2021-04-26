import React from 'react'
import {IdeaMilestoneDto, patchIdeaMilestone, PatchIdeaMilestoneDto} from "../idea.milestones.api";
import {Modal} from "../../../../components/modal/Modal";
import {IdeaMilestoneModalHeader} from "../components/IdeaMilestoneModalHeader";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";
import {IdeaMilestoneForm, IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";
import {IdeaDto} from "../../../ideas.api";

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
    handleConvertSubmit: (ideaMilestone: IdeaMilestoneDto) => void
}

export const ConvertIdeaMilestoneToProposalModal = ({ open, idea, ideaMilestone, handleCloseModal, handleConvertSubmit }: Props) => {

    const { t } = useTranslation()

    const submitForm = ({ subject, dateFrom, dateTo, description, networks }: IdeaMilestoneFormValues) => {
        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
            subject,
            dateFrom,
            dateTo,
            description,
            networks
        }
        patchIdeaMilestone(idea.id, ideaMilestone.id, patchIdeaMilestoneDto)
            .then((patchedIdeaMilestone) => {
                handleConvertSubmit(patchedIdeaMilestone)
            })
            .catch((err) => console.log(err))
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            maxWidth={'md'}
        >
            <IdeaMilestoneModalHeader>
                <h2 id='modal-title'>
                    {t('idea.milestones.convertToProposal.convertToProposal')}
                </h2>
            </IdeaMilestoneModalHeader>
            <IdeaMilestoneForm
                idea={idea}
                ideaMilestone={ideaMilestone}
                readonly={false}
                extendedValidation={true}
                onSubmit={submitForm}
            >
                <Button type='button' color='primary' variant='text' onClick={handleCloseModal}>
                    {t('idea.milestones.modal.form.buttons.cancel')}
                </Button>
                <Button type='submit' color='primary'>
                    {t('idea.milestones.modal.form.buttons.submit')}
                </Button>
            </IdeaMilestoneForm>
        </Modal>
    )
}
