import React, {useMemo} from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {EditIdeaMilestoneModalContent} from "./EditIdeaMilestoneModalContent";
import {IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";
import {IdeaMilestoneDto, patchIdeaMilestone, PatchIdeaMilestoneDto} from "../idea.milestones.api";

interface Props {
    ideaId: string
    ideaMilestoneId: string
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: (isIdeaMilestoneSuccessfullyEdited: boolean) => void
}

export const EditIdeaMilestoneModal = ({ ideaId, ideaMilestoneId, ideaMilestone, handleCloseModal }: Props) => {

    const formValues: IdeaMilestoneFormValues = useMemo(() => {
        const { subject, dateFrom, dateTo, description, networks } = ideaMilestone
        return {
            subject,
            dateFrom,
            dateTo,
            description,
            networks
        }
    }, [ideaMilestoneId, ideaMilestone])

    const submit = async ({ subject, dateFrom, dateTo, description, networks }: IdeaMilestoneFormValues) => {
        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
            subject,
            dateFrom,
            dateTo,
            description,
            networks
        }
        await patchIdeaMilestone(ideaId, ideaMilestoneId, patchIdeaMilestoneDto)
        handleCloseModal(true)
    }

    return (
        <Modal
            open={true}
            onClose={() => handleCloseModal(false)}
            aria-labelledby="modal-title"
            maxWidth={'md'}
        >
            <EditIdeaMilestoneModalContent
                formValues={formValues}
                onCancel={() => handleCloseModal(false)}
                onSumbit={submit}
            />
        </Modal>
    )
}
