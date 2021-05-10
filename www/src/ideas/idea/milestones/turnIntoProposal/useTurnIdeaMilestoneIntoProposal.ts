import { useMemo } from 'react'
import { IdeaDto, IdeaStatus } from '../../../ideas.api'
import { IdeaMilestoneDto, IdeaMilestoneStatus } from '../idea.milestones.api'

export const useTurnIdeaMilestoneIntoProposal = (idea: IdeaDto, ideaMilestone: IdeaMilestoneDto) => {

    const canTurnIntoProposal = useMemo(() => {
        return idea.status !== IdeaStatus.TurnedIntoProposal && ideaMilestone.status !== IdeaMilestoneStatus.TurnedIntoProposal
    }, [idea.status, ideaMilestone.status])

    return {
        canTurnIntoProposal
    }

}