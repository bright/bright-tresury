import React from 'react'
import {IdeaMilestoneDto, patchIdeaMilestone, PatchIdeaMilestoneDto} from "../idea.milestones.api";
import {Modal} from "../../../../components/modal/Modal";
import {IdeaMilestoneModalHeader} from "../components/IdeaMilestoneModalHeader";
import {useTranslation} from "react-i18next";
import {Button} from "../../../../components/button/Button";
import {IdeaMilestoneForm, IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";
import {IdeaDto} from "../../../ideas.api";
import TransactionError from "../../../../substrate-lib/components/TransactionError";

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
    handleTurnSubmit: (ideaMilestone: IdeaMilestoneDto) => void
}

export const TurnIdeaMilestoneIntoProposalModal = ({ open, idea, ideaMilestone, handleCloseModal, handleTurnSubmit }: Props) => {

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
                handleTurnSubmit(patchedIdeaMilestone)
            })
            .catch(() => {
                // TODO: Use the common components for displaying errors in forms when will be ready to use
            })
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby='modal-description'
            maxWidth={'md'}
        >
            { idea.beneficiary
                ? (
                    <>
                        <IdeaMilestoneModalHeader>
                            <h2 id='modal-title'>
                                {t('idea.milestones.turnIntoProposal.turnIntoProposal')}
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
                    </>
                )
                : (
                    <TransactionError
                        onOk={handleCloseModal}
                        title={t('idea.milestones.turnIntoProposal.emptyBeneficiaryValidationError.title')}
                        subtitle={t('idea.milestones.turnIntoProposal.emptyBeneficiaryValidationError.subtitle')}
                    />
                )
            }
        </Modal>
    )
}
