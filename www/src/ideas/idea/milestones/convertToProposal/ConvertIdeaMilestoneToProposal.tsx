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
    const [convertModalOpen, setConvertModalOpen] = useState<boolean>(true)
    const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false)

    const handleConvertModalClose = () => {
        setConvertModalOpen(false)
        onCancel()
    }

    const handleSubmitModalClose = () => {
        setSubmitModalOpen(false)
        setPatchedIdeaMilestone(null)
        onCancel()
    }

    const handleConvertSubmit = (patchedIdeaMilestone: IdeaMilestoneDto) => {
        setPatchedIdeaMilestone(patchedIdeaMilestone)
        setConvertModalOpen(false)
        setSubmitModalOpen(true)
    }

    const goToProposals = () => {
        history.push(ROUTE_PROPOSALS)
    }

    return (
        <>
            <ConvertIdeaMilestoneToProposalModal
                open={convertModalOpen}
                idea={idea}
                ideaMilestone={ideaMilestone}
                handleCloseModal={handleConvertModalClose}
                handleConvertSubmit={handleConvertSubmit}
            />
            { patchedIdeaMilestone
                ? <SubmitConvertIdeaMilestoneToProposalModal
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