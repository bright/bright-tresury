import { useMemo } from 'react'
import { IdeaDto, IdeaStatus } from '../../ideas.dto'
import { useIdea } from '../useIdea'
import {
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto,
    IdeaMilestoneNetworkStatus,
    IdeaMilestoneStatus,
} from './idea.milestones.dto'

export const useIdeaMilestone = (idea: IdeaDto, milestone?: IdeaMilestoneDto) => {
    const { isOwner } = useIdea(idea)
    const isIdeaActive = idea.status === IdeaStatus.Active
    const isIdeaDraft = idea.status === IdeaStatus.Draft
    const isIdeaTurnedIntoProposalByMilestone = idea.status === IdeaStatus.MilestoneSubmission
    const isMilestoneActive = milestone?.status === IdeaMilestoneStatus.Active

    const canEdit = useMemo(() => {
        if (!milestone) return true
        return isOwner && (isIdeaActive || isIdeaDraft || (isIdeaTurnedIntoProposalByMilestone && isMilestoneActive))
    }, [milestone, isOwner, isIdeaActive, isIdeaDraft, isIdeaTurnedIntoProposalByMilestone, isMilestoneActive])

    const canTurnIntoProposal = useMemo(() => {
        if (!milestone) return false
        const ideaMilestoneNetworkStatus = milestone.currentNetwork.status
        return (
            isOwner &&
            (isIdeaActive ||
                isIdeaDraft ||
                (isIdeaTurnedIntoProposalByMilestone &&
                    ideaMilestoneNetworkStatus &&
                    ideaMilestoneNetworkStatus !== IdeaMilestoneNetworkStatus.TurnedIntoProposal))
        )
    }, [milestone, isOwner, isIdeaActive, isIdeaDraft, isIdeaTurnedIntoProposalByMilestone])

    const canEditIdeaMilestoneNetwork = (ideaMilestoneNetwork: IdeaMilestoneNetworkDto) =>
        ideaMilestoneNetwork.status !== IdeaMilestoneNetworkStatus.TurnedIntoProposal

    const canEditAnyIdeaMilestoneNetwork = useMemo(
        () =>
            milestone
                ? milestone.additionalNetworks.reduce(
                      (acc, ideaMilestoneNetwork) => acc || canEditIdeaMilestoneNetwork(ideaMilestoneNetwork),
                      canEditIdeaMilestoneNetwork(milestone.currentNetwork),
                  )
                : false,
        [milestone],
    )

    return {
        canEdit,
        canTurnIntoProposal,
        canEditIdeaMilestoneNetwork,
        canEditAnyIdeaMilestoneNetwork,
    }
}
