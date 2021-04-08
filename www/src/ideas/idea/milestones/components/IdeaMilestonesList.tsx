import React, {useState} from 'react'
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {EditIdeaMilestoneModal} from "../edit/EditIdeaMilestoneModal";
import {DisplayIdeaMilestoneModal} from "../display/DisplayIdeaMilestoneModal";

interface Props {
    ideaId: string
    canEdit: boolean
    ideaMilestones: IdeaMilestoneDto[]
    fetchIdeaMilestones: (ideaId: string) => Promise<void>
}

export const IdeaMilestonesList = ({ ideaId, canEdit, ideaMilestones, fetchIdeaMilestones }: Props) => {

    const [focusedIdeaMilestone, setFocusedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)
    const [isEditIdeaMilestoneModalOpen, setisEditIdeaMilestoneModalOpen] = useState<boolean>(false)
    const [isDisplayIdeaMilestoneModalOpen, setisDisplayIdeaMilestoneModalOpen] = useState<boolean>(false)

    const handleEditIdeaMilestoneModalClose = (isIdeaMilestoneSuccessfullyEdited: boolean) => {

        setisEditIdeaMilestoneModalOpen(false)
        setFocusedIdeaMilestone(null)

        if (isIdeaMilestoneSuccessfullyEdited) {
            fetchIdeaMilestones(ideaId)
        }
    }

    const handleDisplayIdeaMilestoneModalClose = () => {
        setisDisplayIdeaMilestoneModalOpen(false)
        setFocusedIdeaMilestone(null)
    }

    const handleIdeaMilestoneClick = (ideaMilestone: IdeaMilestoneDto) => {
        if (canEdit) {
            setisEditIdeaMilestoneModalOpen(true)
        } else {
            setisDisplayIdeaMilestoneModalOpen(true)
        }
        setFocusedIdeaMilestone(ideaMilestone)
    }

    return (
        <>
            <ul>
                {ideaMilestones.map((ideaMilestone: IdeaMilestoneDto) => (
                    <li key={ideaMilestone.id} onClick={() => handleIdeaMilestoneClick(ideaMilestone)}>
                        <div>
                            <span>{ideaMilestone.subject} ({ideaMilestone.id})</span>
                        </div>
                    </li>
                ))}
            </ul>
            { focusedIdeaMilestone && isEditIdeaMilestoneModalOpen &&
                    <EditIdeaMilestoneModal ideaId={ideaId} ideaMilestoneId={focusedIdeaMilestone.id} ideaMilestone={focusedIdeaMilestone} handleCloseModal={handleEditIdeaMilestoneModalClose} />
            }
            { focusedIdeaMilestone && isDisplayIdeaMilestoneModalOpen &&
                    <DisplayIdeaMilestoneModal ideaMilestone={focusedIdeaMilestone} handleCloseModal={handleDisplayIdeaMilestoneModalClose} />
            }
        </>

    )
}