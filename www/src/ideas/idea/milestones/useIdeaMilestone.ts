import { useMemo } from 'react'
import { IdeaDto, IdeaStatus } from '../../ideas.dto'
import { useIdea } from '../useIdea'
import { IdeaMilestoneDto, IdeaMilestoneNetworkStatus, IdeaMilestoneStatus } from './idea.milestones.dto'
import { useNetworks } from '../../../networks/useNetworks'
import { findIdeaMilestoneNetwork } from './idea.milestones.utils'

export const useIdeaMilestone = (milestone: IdeaMilestoneDto, idea: IdeaDto) => {
    const { isOwner } = useIdea(idea)
    const { network: currentNetwork } = useNetworks()
    const canEdit = useMemo(
        () =>
            isOwner &&
            (idea.status === IdeaStatus.Active ||
                idea.status === IdeaStatus.Draft ||
                (idea.status === IdeaStatus.TurnedIntoProposalByMilestone &&
                    milestone.status === IdeaMilestoneStatus.Active)),
        [milestone, isOwner],
    )

    const canTurnIntoProposal = useMemo(() => {
        const isIdeaActive = idea.status === IdeaStatus.Active
        const isIdeaDraft = idea.status === IdeaStatus.Draft
        const isIdeaTurnedIntoProposalByMilestone = idea.status === IdeaStatus.TurnedIntoProposalByMilestone
        const ideaMilestoneNetworkStatus = findIdeaMilestoneNetwork(milestone.networks, currentNetwork)?.status
        return (
            isOwner &&
            (isIdeaActive ||
                isIdeaDraft ||
                (isIdeaTurnedIntoProposalByMilestone &&
                    ideaMilestoneNetworkStatus &&
                    ideaMilestoneNetworkStatus !== IdeaMilestoneNetworkStatus.TurnedIntoProposal))
        )
    }, [isOwner, idea, milestone.status])

    return {
        canEdit,
        canTurnIntoProposal,
    }
}
