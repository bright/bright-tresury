import { useAuth } from '../../auth/AuthContext'
import { useNetworks } from '../../networks/useNetworks'
import { useGetIdea } from '../ideas.api'
import { useMemo } from 'react'
import { IdeaNetworkStatus, IdeaStatus } from '../ideas.dto'

export const useIdea = (ideaId: string) => {
    const { network } = useNetworks()
    const { status, data: idea } = useGetIdea({ ideaId, network: network.id })

    const { isUserSignedInAndVerified, user } = useAuth()

    const isOwner = useMemo(() => {
        return isUserSignedInAndVerified && idea?.ownerId === user?.id
    }, [isUserSignedInAndVerified, idea, user])

    const canEdit = useMemo(() => {
        return isOwner
    }, [isOwner])

    const canTurnIntoProposal = useMemo(
        () =>
            idea &&
            isOwner &&
            idea.status !== IdeaStatus.TurnedIntoProposalByMilestone &&
            idea.currentNetwork.status !== IdeaNetworkStatus.TurnedIntoProposal,
        [idea, isOwner],
    )

    return {
        status,
        idea,
        canEdit,
        isOwner,
        canTurnIntoProposal,
    }
}
