import { useMemo } from 'react'
import { IdeaDto, IdeaStatus } from '../../ideas.dto'
import { useIdea } from '../useIdea'
import {
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto,
    IdeaMilestoneNetworkStatus,
    IdeaMilestoneStatus,
} from './idea.milestones.dto'

export interface UseIdeaMilestoneResult {
    canEdit: boolean
    canTurnIntoProposal: boolean
    canEditAnyIdeaMilestoneNetwork: boolean
    canEditIdeaMilestoneNetwork: (status: IdeaMilestoneNetworkStatus) => boolean
}

export const useIdeaMilestone = (idea: IdeaDto, milestone?: IdeaMilestoneDto): UseIdeaMilestoneResult => {
    const { isOwner, canEditIdeaMilestones } = useIdea(idea)
    const isIdeaActive = idea.status === IdeaStatus.Active
    const isIdeaDraft = idea.status === IdeaStatus.Draft
    const isMilestoneSubmission = idea.status === IdeaStatus.MilestoneSubmission

    const canEdit = useMemo(() => {
        return canEditIdeaMilestones && (!milestone || milestone.status === IdeaMilestoneStatus.Active)
    }, [canEditIdeaMilestones, milestone])

    const canTurnIntoProposal = useMemo(() => {
        if (!milestone) return false
        const ideaMilestoneNetworkStatus = milestone.currentNetwork.status
        return (
            isOwner &&
            (isIdeaActive ||
                isIdeaDraft ||
                (isMilestoneSubmission &&
                    (ideaMilestoneNetworkStatus === IdeaMilestoneNetworkStatus.Active ||
                        ideaMilestoneNetworkStatus === IdeaMilestoneNetworkStatus.Pending)))
        )
    }, [milestone, isOwner, isIdeaActive, isIdeaDraft, isMilestoneSubmission])

    const canEditIdeaMilestoneNetwork = (status: IdeaMilestoneNetworkStatus) =>
        canEditIdeaMilestones && status !== IdeaMilestoneNetworkStatus.TurnedIntoProposal

    const canEditAnyIdeaMilestoneNetwork = useMemo(() => {
        if (!milestone) return true
        return (
            canEditIdeaMilestoneNetwork(milestone.currentNetwork.status) ||
            !!milestone.additionalNetworks.find((network) => canEditIdeaMilestoneNetwork(network.status))
        )
    }, [milestone])

    return {
        canEdit,
        canTurnIntoProposal,
        canEditIdeaMilestoneNetwork,
        canEditAnyIdeaMilestoneNetwork,
    }
}
