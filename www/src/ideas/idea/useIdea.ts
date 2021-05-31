import { useAuth } from '../../auth/AuthContext'
import { useGetIdea } from '../ideas.api'
import { useMemo } from 'react'

export const useIdea = (ideaId: string) => {
    const { status, data: idea } = useGetIdea(ideaId)

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
