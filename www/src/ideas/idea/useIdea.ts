import { useMemo } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { Nil } from '../../util/types'
import { IdeaDto, IdeaStatus } from '../ideas.dto'

export interface UseIdeaResult {
    isOwner: boolean
    isIdeaEditable: boolean
    canEditIdea: boolean
    isIdeaMilestonesEditable: boolean
    canEditIdeaMilestones: boolean
    canTurnIntoProposal: boolean
}

export const useIdea = (idea: Nil<IdeaDto>): UseIdeaResult => {
    const { isUserSignedInAndVerified, user } = useAuth()

    const isOwner = useMemo(() => {
        return isUserSignedInAndVerified && idea?.owner.userId === user?.id
    }, [isUserSignedInAndVerified, idea, user])

    const isIdeaEditable = useMemo(() => {
        return !!idea && (idea.status === IdeaStatus.Active || idea.status === IdeaStatus.Draft)
    }, [idea])

    const canEditIdea = useMemo(() => {
        return isOwner && isIdeaEditable
    }, [isOwner, isIdeaEditable])

    const isIdeaMilestonesEditable = useMemo(
        () =>
            !!idea &&
            (idea.status === IdeaStatus.Active ||
                idea.status === IdeaStatus.Draft ||
                idea.status === IdeaStatus.MilestoneSubmission),
        [idea],
    )

    const canEditIdeaMilestones = useMemo(
        () => isOwner && isIdeaMilestonesEditable,
        [isIdeaMilestonesEditable, isOwner],
    )

    const canTurnIntoProposal = useMemo(
        () => !!idea && isOwner && (idea.status === IdeaStatus.Active || idea.status === IdeaStatus.Pending),
        [idea, isOwner],
    )

    return {
        isOwner,
        isIdeaEditable,
        canEditIdea,
        isIdeaMilestonesEditable,
        canEditIdeaMilestones,
        canTurnIntoProposal,
    }
}
