import { useMemo } from 'react'
import { IdeaDto, IdeaStatus } from '../../ideas.dto'
import { useIdea } from '../useIdea'
import { IdeaMilestoneDto, IdeaMilestoneStatus } from './idea.milestones.dto'

export const useIdeaMilestone = (milestone: IdeaMilestoneDto, idea: IdeaDto) => {
    const { isOwner } = useIdea(idea)

    const canEdit = useMemo(
        () =>
            isOwner &&
            (idea.status === IdeaStatus.Active ||
                idea.status === IdeaStatus.Draft ||
                (idea.status === IdeaStatus.TurnedIntoProposalByMilestone &&
                    milestone.status === IdeaMilestoneStatus.Active)),
        [milestone, isOwner],
    )

    const canTurnIntoProposal = useMemo(
        () =>
            isOwner &&
            (idea.status === IdeaStatus.Active ||
                idea.status === IdeaStatus.Draft ||
                (idea.status === IdeaStatus.TurnedIntoProposalByMilestone &&
                    milestone.status !== IdeaMilestoneStatus.TurnedIntoProposal)),

        [isOwner, idea, milestone.status],
    )

    return {
        canEdit,
        canTurnIntoProposal,
    }
}
