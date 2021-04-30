import React, {useState} from "react";
import {ConvertIdeaMilestoneToProposalModal} from "./ConvertIdeaMilestoneToProposalModal";
import {IdeaMilestoneDto} from "../idea.milestones.api";
import {IdeaDto} from "../../../ideas.api";
import {ROUTE_PROPOSALS} from "../../../../routes/routes";
import {useHistory} from "react-router-dom";
import {SubmitConvertIdeaMilestoneToProposalModal} from "./SubmitConvertIdeaMilestoneToProposalModal";

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onCancel: () => void
}

export const ConvertIdeaMilestoneToProposal = ({ idea, ideaMilestone, onCancel }: Props) => {

    const history = useHistory()

    const [patchedIdeaMilestone, setPatchedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)
    const [convertIdeaMilestoneToProposalModalOpen, setConvertIdeaMilestoneToProposalModalOpen] = useState<boolean>(true)
    const [submitConvertIdeaMilestoneToProposalModalOpen, setSubmitConvertIdeaMilestoneToProposalModalOpen] = useState<boolean>(false)

    const handleConvertIdeaMilestoneToProposalModalClose = () => {
        setConvertIdeaMilestoneToProposalModalOpen(false)
        onCancel()
    }

    const handleSubmitConvertIdeaMilestoneToProposalModelClose = () => {
        setSubmitConvertIdeaMilestoneToProposalModalOpen(false)
        setPatchedIdeaMilestone(null)
        onCancel()
    }

    const handleConvertSubmit = (patchedIdeaMilestone: IdeaMilestoneDto) => {
        setPatchedIdeaMilestone(patchedIdeaMilestone)
        setConvertIdeaMilestoneToProposalModalOpen(false)
        setSubmitConvertIdeaMilestoneToProposalModalOpen(true)
    }

    const goToProposals = () => {
        history.push(ROUTE_PROPOSALS)
    }

    return (
        <>
            <ConvertIdeaMilestoneToProposalModal
                open={convertIdeaMilestoneToProposalModalOpen}
                idea={idea}
                ideaMilestone={ideaMilestone}
                handleCloseModal={handleConvertIdeaMilestoneToProposalModalClose}
                handleConvertSubmit={handleConvertSubmit}
            />
            { patchedIdeaMilestone
                ? <SubmitConvertIdeaMilestoneToProposalModal
                    open={submitConvertIdeaMilestoneToProposalModalOpen}
                    idea={idea}
                    ideaMilestone={patchedIdeaMilestone}
                    onSuccess={goToProposals}
                    onClose={handleSubmitConvertIdeaMilestoneToProposalModelClose}
                 />
                : null
            }
        </>
    )
}