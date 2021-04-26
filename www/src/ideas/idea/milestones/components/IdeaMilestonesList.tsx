import React, {useState} from 'react'
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {EditIdeaMilestoneModal} from "../edit/EditIdeaMilestoneModal";
import {DisplayIdeaMilestoneModal} from "../display/DisplayIdeaMilestoneModal";
import {IdeaDto} from "../../../ideas.api";

interface Props {
    idea: IdeaDto
    ideaMilestones: IdeaMilestoneDto[]
    canEdit: boolean
    fetchIdeaMilestones: () => Promise<void>
}

export const IdeaMilestonesList = ({ idea, ideaMilestones, canEdit, fetchIdeaMilestones }: Props) => {

    const [focusedIdeaMilestone, setFocusedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)
    const [isEditIdeaMilestoneModalOpen, setisEditIdeaMilestoneModalOpen] = useState<boolean>(false)
    const [isDisplayIdeaMilestoneModalOpen, setisDisplayIdeaMilestoneModalOpen] = useState<boolean>(false)

    const handleEditIdeaMilestoneModalClose = () => {
        setisEditIdeaMilestoneModalOpen(false)
        setFocusedIdeaMilestone(null)
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
            { focusedIdeaMilestone
                ? <EditIdeaMilestoneModal
                    open={isEditIdeaMilestoneModalOpen}
                    idea={idea}
                    ideaMilestone={focusedIdeaMilestone}
                    handleCloseModal={handleEditIdeaMilestoneModalClose}
                    fetchIdeaMilestones={fetchIdeaMilestones}
                  />
                : null
            }
            { focusedIdeaMilestone
                ? <DisplayIdeaMilestoneModal
                    open={isDisplayIdeaMilestoneModalOpen}
                    idea={idea}
                    ideaMilestone={focusedIdeaMilestone}
                    handleCloseModal={handleDisplayIdeaMilestoneModalClose}
                  />
                : null
            }
        </>

    )
}