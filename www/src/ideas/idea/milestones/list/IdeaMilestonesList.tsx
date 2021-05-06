import React, {useState} from 'react'
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {EditIdeaMilestoneModal} from "../edit/EditIdeaMilestoneModal";
import {DisplayIdeaMilestoneModal} from "../display/DisplayIdeaMilestoneModal";
import {IdeaDto} from "../../../ideas.api";
import {Grid} from "../../../../components/grid/Grid";
import {IdeaMilestoneCard} from "./IdeaMilestoneCard";
import {mobileHeaderListHorizontalMargin} from "../../../../components/header/list/HeaderListContainer";
import {TurnIdeaMilestoneIntoProposal} from "../turnIntoProposal/TurnIdeaMilestoneIntoProposal";

interface Props {
    idea: IdeaDto
    ideaMilestones: IdeaMilestoneDto[]
    canEdit: boolean
    fetchIdeaMilestones: () => Promise<void>
}

export const IdeaMilestonesList = ({ idea, ideaMilestones, canEdit, fetchIdeaMilestones }: Props) => {

    const [focusedIdeaMilestone, setFocusedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)
    const [ideaMilestoneToTurnIntoProposal, setIdeaMilestoneToTurnIntoProposal] = useState<IdeaMilestoneDto | null>(null)
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
    const [displayModalOpen, setDisplayModalOpen] = useState<boolean>(false)

    const handleEditModalClose = () => {
        setEditModalOpen(false)
        setFocusedIdeaMilestone(null)
    }

    const handleDisplayModalClose = () => {
        setDisplayModalOpen(false)
        setFocusedIdeaMilestone(null)
    }

    const handleIdeaMilestoneClick = (ideaMilestone: IdeaMilestoneDto) => {
        if (canEdit) {
            setEditModalOpen(true)
        } else {
            setDisplayModalOpen(true)
        }
        setFocusedIdeaMilestone(ideaMilestone)
    }

    const handleTurnIdeaMilestoneIntoProposal = (ideaMilestone: IdeaMilestoneDto) => {
        setIdeaMilestoneToTurnIntoProposal(ideaMilestone)
    }

    const handleTurnIntoProposalCancel = () => setIdeaMilestoneToTurnIntoProposal(null)

    const renderIdeaMilestoneCard = (ideaMilestone: IdeaMilestoneDto) => {
        return <IdeaMilestoneCard ideaMilestone={ideaMilestone} onClick={handleIdeaMilestoneClick} />
    }

    return (
        <>
            <Grid
                items={ideaMilestones}
                renderItem={renderIdeaMilestoneCard}
                horizontalPadding={'0px'}
                mobileHorizontalPadding={mobileHeaderListHorizontalMargin}
            />
            { focusedIdeaMilestone
                ? <EditIdeaMilestoneModal
                    open={editModalOpen}
                    idea={idea}
                    ideaMilestone={focusedIdeaMilestone}
                    handleCloseModal={handleEditModalClose}
                    handleTurnIdeaMilestoneIntoProposal={handleTurnIdeaMilestoneIntoProposal}
                    fetchIdeaMilestones={fetchIdeaMilestones}
                  />
                : null
            }
            { focusedIdeaMilestone
                ? <DisplayIdeaMilestoneModal
                    open={displayModalOpen}
                    idea={idea}
                    ideaMilestone={focusedIdeaMilestone}
                    handleCloseModal={handleDisplayModalClose}
                  />
                : null
            }
            { ideaMilestoneToTurnIntoProposal
                ? <TurnIdeaMilestoneIntoProposal
                    idea={idea}
                    ideaMilestone={ideaMilestoneToTurnIntoProposal}
                    onCancel={handleTurnIntoProposalCancel}
                  />
                : null
            }
        </>

    )
}