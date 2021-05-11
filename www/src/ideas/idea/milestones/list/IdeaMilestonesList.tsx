import React, {useState} from 'react'
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaMilestoneEditModal} from "../edit/IdeaMilestoneEditModal";
import {IdeaMilestoneDetailsModal} from "../details/IdeaMilestoneDetailsModal";
import {IdeaDto} from "../../../ideas.api";
import {Grid} from "../../../../components/grid/Grid";
import {IdeaMilestoneCard} from "./IdeaMilestoneCard";
import {mobileHeaderListHorizontalMargin} from "../../../../components/header/list/HeaderListContainer";
import { TurnIdeaMilestoneIntoProposalModal } from '../turnIntoProposal/TurnIdeaMilestoneIntoProposalModal'
import { SubmitTurnIdeaMilestoneIntoProposalModal } from '../turnIntoProposal/SubmitTurnIdeaMilestoneIntoProposalModal'
import { useModal } from '../../../../components/modal/useModal'

interface Props {
    idea: IdeaDto
    ideaMilestones: IdeaMilestoneDto[]
    canEdit: boolean
    fetchIdeaMilestones: () => Promise<void>
}

export const IdeaMilestonesList = ({ idea, ideaMilestones, canEdit, fetchIdeaMilestones }: Props) => {

    const [focusedIdeaMilestone, setFocusedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)
    const [ideaMilestoneToBeTurnedIntoProposal, setIdeaMilestoneToBeTurnedIntoProposal] = useState<IdeaMilestoneDto | null>(null)

    const editModal = useModal()
    const detailsModal = useModal()
    const turnModal = useModal()
    const submitTurnModal = useModal()

    const handleOnEditModalClose = () => {
        editModal.close()
        setFocusedIdeaMilestone(null)
    }

    const handleOnDetailsModalClose = () => {
        detailsModal.close()
        setFocusedIdeaMilestone(null)
    }

    const handleOnSubmitTurnModalClose = async () => {
        submitTurnModal.close()
        // We fetch idea milestone here because data could be patched before transaction
        // and without fetch user could see outdated data
        await fetchIdeaMilestones()
    }

    const handleOnCardClick = (ideaMilestone: IdeaMilestoneDto) => {
        if (canEdit) {
            editModal.open()
        } else {
            detailsModal.open()
        }
        setFocusedIdeaMilestone(ideaMilestone)
    }

    const handleOnTurnIntoProposalClick = (ideaMilestone: IdeaMilestoneDto) => {
        setIdeaMilestoneToBeTurnedIntoProposal(ideaMilestone)
        turnModal.open()
    }

    const handleOnSuccessfulPatchBeforeTurnIntoProposalSubmit = (patchedIdeaMilestone: IdeaMilestoneDto) => {
        turnModal.close()
        editModal.close()
        setIdeaMilestoneToBeTurnedIntoProposal(patchedIdeaMilestone)
        submitTurnModal.open()
    }

    const renderIdeaMilestoneCard = (ideaMilestone: IdeaMilestoneDto) => {
        return <IdeaMilestoneCard ideaMilestone={ideaMilestone} onClick={handleOnCardClick} />
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
                ? (
                    <IdeaMilestoneEditModal
                        open={editModal.visible}
                        idea={idea}
                        ideaMilestone={focusedIdeaMilestone}
                        onClose={handleOnEditModalClose}
                        onTurnIntoProposalClick={handleOnTurnIntoProposalClick}
                        fetchIdeaMilestones={fetchIdeaMilestones}
                  />
                )
                : null
            }

            { focusedIdeaMilestone
                ? (
                    <IdeaMilestoneDetailsModal
                        open={detailsModal.visible}
                        idea={idea}
                        ideaMilestone={focusedIdeaMilestone}
                        onClose={handleOnDetailsModalClose}
                    />
                )
                : null
            }

            { ideaMilestoneToBeTurnedIntoProposal
                ? (
                    <TurnIdeaMilestoneIntoProposalModal
                        open={turnModal.visible}
                        idea={idea}
                        ideaMilestone={ideaMilestoneToBeTurnedIntoProposal}
                        onClose={turnModal.close}
                        onSuccessfulPatch={handleOnSuccessfulPatchBeforeTurnIntoProposalSubmit}
                    />
                )
                : null
            }

            { ideaMilestoneToBeTurnedIntoProposal
                ? (
                    <SubmitTurnIdeaMilestoneIntoProposalModal
                        open={submitTurnModal.visible}
                        idea={idea}
                        ideaMilestone={ideaMilestoneToBeTurnedIntoProposal}
                        onClose={handleOnSubmitTurnModalClose}
                    />
                )
                : null
            }
        </>
    )
}