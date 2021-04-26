import React, {useState} from 'react'
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {EditIdeaMilestoneModal} from "../edit/EditIdeaMilestoneModal";
import {DisplayIdeaMilestoneModal} from "../display/DisplayIdeaMilestoneModal";
import {IdeaDto} from "../../../ideas.api";
import {Grid} from "../../../../components/grid/Grid";
import {IdeaMilestoneCard} from "./IdeaMilestoneCard";
import {mobileHeaderListHorizontalMargin} from "../../../../components/header/list/HeaderListContainer";
import {ConvertIdeaMilestoneToProposal} from "../convertToProposal/ConvertIdeaMilestoneToProposal";

interface Props {
    idea: IdeaDto
    ideaMilestones: IdeaMilestoneDto[]
    canEdit: boolean
    fetchIdeaMilestones: () => Promise<void>
}

export const IdeaMilestonesList = ({ idea, ideaMilestones, canEdit, fetchIdeaMilestones }: Props) => {

    const [focusedIdeaMilestone, setFocusedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)
    const [ideaMilestoneToConvertToProposal, setIdeaMilestoneToConvertToProposal] = useState<IdeaMilestoneDto | null>(null)
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

    const handleConvertIdeaMilestoneToProposal = (ideaMilestone: IdeaMilestoneDto) => {
        setIdeaMilestoneToConvertToProposal(ideaMilestone)
    }

    const handleConvertIdeaMilestoneToProposalCancel = () => setIdeaMilestoneToConvertToProposal(null)

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
                    open={isEditIdeaMilestoneModalOpen}
                    idea={idea}
                    ideaMilestone={focusedIdeaMilestone}
                    handleCloseModal={handleEditIdeaMilestoneModalClose}
                    handleConvertIdeaMilestoneToProposal={handleConvertIdeaMilestoneToProposal}
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
            { ideaMilestoneToConvertToProposal
                ? <ConvertIdeaMilestoneToProposal
                    idea={idea}
                    ideaMilestone={ideaMilestoneToConvertToProposal}
                    onCancel={handleConvertIdeaMilestoneToProposalCancel}
                  />
                : null
            }
        </>

    )
}