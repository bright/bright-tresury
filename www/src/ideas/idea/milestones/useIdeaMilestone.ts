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
    canEditIdeaMilestoneNetwork: (ideaMilestoneNetwork: IdeaMilestoneNetworkDto) => boolean
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

    const canEditIdeaMilestoneNetwork = (ideaMilestoneNetwork: IdeaMilestoneNetworkDto) =>
        ideaMilestoneNetwork.status !== IdeaMilestoneNetworkStatus.TurnedIntoProposal

    const canEditAnyIdeaMilestoneNetwork = useMemo(() => {
        if (!milestone) return false
        return (
            canEditIdeaMilestones &&
            milestone.additionalNetworks.reduce(
                (acc, ideaMilestoneNetwork) => acc || canEditIdeaMilestoneNetwork(ideaMilestoneNetwork),
                canEditIdeaMilestoneNetwork(milestone.currentNetwork),
            )
        )
    }, [milestone])

    return {
        canEdit,
        canTurnIntoProposal,
        canEditIdeaMilestoneNetwork,
        canEditAnyIdeaMilestoneNetwork,
    }
}
