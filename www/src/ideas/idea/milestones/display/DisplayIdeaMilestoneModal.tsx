import React, {useMemo} from 'react'
import {Modal} from "../../../../components/modal/Modal";
import {DisplayIdeaMilestoneModalContent} from "./DisplayIdeaMilestoneModalContent";
import {IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";
import {IdeaMilestoneDto} from "../idea.milestones.api";

interface Props {
    ideaMilestone: IdeaMilestoneDto
    handleCloseModal: () => void
}

export const DisplayIdeaMilestoneModal = ({ ideaMilestone, handleCloseModal }: Props) => {

    const formValues: IdeaMilestoneFormValues = useMemo(() => {
        const { subject, dateFrom, dateTo, description, networks } = ideaMilestone
        return {
            subject,
            dateFrom,
            dateTo,
            description,
            networks
        }
    }, [ideaMilestone.id, ideaMilestone])

    const submit = (ideaMilestoneFormValues: IdeaMilestoneFormValues) => {
        // Submit mock to be able reuse formik form to display milestone values
        // https://github.com/formium/formik/issues/2675 (waiting for the linked feature)
    }

    return (
        <Modal
            open={true}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            maxWidth={'md'}
        >
            <DisplayIdeaMilestoneModalContent
                ideaMilestoneOrdinalNumber={ideaMilestone.ordinalNumber}
                formValues={formValues}
                onCancel={handleCloseModal}
                onSumbit={submit}
            />
        </Modal>
    )
}
