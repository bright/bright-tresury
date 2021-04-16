import React, {useMemo} from 'react'
import {createIdeaMilestone, CreateIdeaMilestoneDto, IdeaMilestoneNetworkDto} from "../idea.milestones.api";
import {Modal} from "../../../../components/modal/Modal";
import {CreateIdeaMilestoneModalContent} from "./CreateIdeaMilestoneModalContent";
import {IdeaMilestoneFormValues} from "../form/IdeaMilestoneForm";

interface Props {
    ideaId: string
    network: string
    handleCloseModal: (isIdeaMilestoneSuccessfullyCreated: boolean) => void
}

export const CreateIdeaMilestoneModal = ({ ideaId, network, handleCloseModal }: Props) => {

    const formValues: IdeaMilestoneFormValues = useMemo(() => {
        return {
            subject: '',
            dateFrom: undefined,
            dateTo: undefined,
            description: '',
            networks: [{ name: network, value: 0 } as IdeaMilestoneNetworkDto]
        }
    }, [network])

    const submit = async ({ subject, dateFrom, dateTo, description, networks }: IdeaMilestoneFormValues) => {
        const createIdeaMilestoneDto: CreateIdeaMilestoneDto = {
            subject,
            dateFrom,
            dateTo,
            description,
            networks
        }
        await createIdeaMilestone(ideaId, createIdeaMilestoneDto)
        handleCloseModal(true)
    }

    return (
        <Modal
            open={true}
            onClose={() => handleCloseModal(false)}
            aria-labelledby="modal-title"
            maxWidth={'md'}
        >
            <CreateIdeaMilestoneModalContent
                formValues={formValues}
                onCancel={() => handleCloseModal(false)}
                onSumbit={submit}
            />
        </Modal>
    )
}
