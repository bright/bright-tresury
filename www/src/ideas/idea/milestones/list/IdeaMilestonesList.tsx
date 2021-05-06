import React, {useState} from 'react'
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {EditIdeaMilestoneModal} from "../edit/EditIdeaMilestoneModal";
import {DisplayIdeaMilestoneModal} from "../display/DisplayIdeaMilestoneModal";
import {IdeaDto} from "../../../ideas.api";
import {Grid} from "../../../../components/grid/Grid";
import {IdeaMilestoneCard} from "./IdeaMilestoneCard";
import {mobileHeaderListHorizontalMargin} from "../../../../components/header/list/HeaderListContainer";
import { TurnIdeaMilestoneIntoProposalConfirmModal } from '../turnIntoProposal/TurnIdeaMilestoneIntoProposalConfirmModal'
import { SubmitTurnIdeaMilestoneIntoProposalModal } from '../turnIntoProposal/SubmitTurnIdeaMilestoneIntoProposalModal'

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

    const [turnConfirmModalOpen, setTurnConfirmModalOpen] = useState<boolean>(false)
    const [submitTurnModalOpen, setSubmitTurnModalOpen] = useState<boolean>(false)

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
        setTurnConfirmModalOpen(true)

    }

    // const handleTurnIntoProposalCancel = () => setIdeaMilestoneToTurnIntoProposal(null)

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
                ? (
                    <TurnIdeaMilestoneIntoProposalConfirmModal
                        open={turnConfirmModalOpen}
                        idea={idea}
                        ideaMilestone={ideaMilestoneToTurnIntoProposal}
                        onClose={() => setTurnConfirmModalOpen(false)}
                        onCancel={() => setTurnConfirmModalOpen(false)}
                        onTurnIntoProposalClick={() => {
                            setTurnConfirmModalOpen(false)
                            setEditModalOpen(false)
                            setSubmitTurnModalOpen(true)
                        }}
                    />
                )
                : null
            }

            { ideaMilestoneToTurnIntoProposal
                ? (
                    <SubmitTurnIdeaMilestoneIntoProposalModal
                        open={submitTurnModalOpen}
                        idea={idea}
                        ideaMilestone={ideaMilestoneToTurnIntoProposal}
                        onClose={() => {
                            setSubmitTurnModalOpen(false)
                        }}
                    />
                )
                : null
            }

            {/*{ ideaMilestoneToTurnIntoProposal*/}
            {/*    ? <TurnIdeaMilestoneIntoProposal*/}
            {/*        idea={idea}*/}
            {/*        ideaMilestone={ideaMilestoneToTurnIntoProposal}*/}
            {/*        onCancel={handleTurnIntoProposalCancel}*/}
            {/*      />*/}
            {/*    : null*/}
            {/*}*/}
        </>
    )
}