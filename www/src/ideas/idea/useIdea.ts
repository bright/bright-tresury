import { useAuth } from '../../auth/AuthContext'
import { useNetworks } from '../../networks/useNetworks'
import { useGetIdea } from '../ideas.api'
import { useMemo } from 'react'

export const useIdea = (ideaId: string) => {
    const { network } = useNetworks()
    const { status, data: idea } = useGetIdea({ ideaId, network: network.id })

    const { isUserSignedInAndVerified, user } = useAuth()

    const canEdit = useMemo(() => {
        return isUserSignedInAndVerified && idea?.ownerId === user?.id
    }, [isUserSignedInAndVerified, idea, user])

    return {
        status,
        idea,
        canEdit,
    }
}
