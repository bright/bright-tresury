import { useEffect, useState } from 'react'
import { getIdea, IdeaDto } from '../../../ideas/ideas.api'

export const useProposalMilestones = (ideaId: string) => {
    const [idea, setIdea] = useState<IdeaDto | undefined>()

    useEffect(() => {
        getIdea(ideaId)
            .then((res) => setIdea(res))
            .catch(() => {
                // TODO: Handle API call error
            })
    }, [ideaId])

    return {
        idea,
    }
}
