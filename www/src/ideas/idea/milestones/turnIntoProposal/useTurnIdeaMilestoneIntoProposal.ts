import { useMemo } from 'react'
import { IdeaDto, IdeaStatus } from '../../../ideas.dto'
import { IdeaMilestoneDto, IdeaMilestoneStatus } from '../idea.milestones.dto'

export const useTurnIdeaMilestoneIntoProposal = (idea: IdeaDto, ideaMilestone: IdeaMilestoneDto) => {
    const canTurnIntoProposal = useMemo(() => {
        return (
            idea.status !== IdeaStatus.TurnedIntoProposal &&
            ideaMilestone.status !== IdeaMilestoneStatus.TurnedIntoProposal
        )
    }, [idea.status, ideaMilestone.status])

    return {
        canTurnIntoProposal,
    }
}
