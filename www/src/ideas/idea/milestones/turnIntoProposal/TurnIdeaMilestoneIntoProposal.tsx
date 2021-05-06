import React, {useState} from "react";
import {TurnIdeaMilestoneIntoProposalModal} from "./TurnIdeaMilestoneIntoProposalModal";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";
import {ROUTE_PROPOSALS} from "../../../../routes/routes";
import {useHistory} from "react-router-dom";
import {SubmitTurnIdeaMilestoneIntoProposalModal} from "./SubmitTurnIdeaMilestoneIntoProposalModal";

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onCancel: () => void
}

export const TurnIdeaMilestoneIntoProposal = ({ idea, ideaMilestone, onCancel }: Props) => {

    const history = useHistory()

    const [patchedIdeaMilestone, setPatchedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)
    const [turnModalOpen, setTurnModalOpen] = useState<boolean>(true)
    const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false)

    const handleTurnModalClose = () => {
        setTurnModalOpen(false)
        onCancel()
    }

    const handleSubmitModalClose = () => {
        setSubmitModalOpen(false)
        setPatchedIdeaMilestone(null)
        onCancel()
    }

    const handleTurnSubmit = (patchedIdeaMilestone: IdeaMilestoneDto) => {
        setPatchedIdeaMilestone(patchedIdeaMilestone)
        setTurnModalOpen(false)
        setSubmitModalOpen(true)
    }

    const goToProposals = () => {
        history.push(ROUTE_PROPOSALS)
    }

    return (
        <>
            <TurnIdeaMilestoneIntoProposalModal
                open={turnModalOpen}
                idea={idea}
                ideaMilestone={ideaMilestone}
                handleCloseModal={handleTurnModalClose}
                handleTurnSubmit={handleTurnSubmit}
            />
            { patchedIdeaMilestone
                ? <SubmitTurnIdeaMilestoneIntoProposalModal
                    open={submitModalOpen}
                    idea={idea}
                    ideaMilestone={patchedIdeaMilestone}
                    onSuccess={goToProposals}
                    onClose={handleSubmitModalClose}
                 />
                : null
            }
        </>
    )
}