import React, { useEffect } from 'react'
import { IdeaMilestones } from '../../../ideas/idea/milestones/IdeaMilestones'
import { getIdea } from '../../../ideas/ideas.api'
import { useLoading } from '../../../components/loading/useLoading'

interface Props {
    ideaId: string
}

export const ProposalMilestones = ({ ideaId }: Props) => {
    const { response: idea, call } = useLoading(getIdea)

    useEffect(() => {
        call(ideaId)
    }, [ideaId, call])

    return <>{idea ? <IdeaMilestones idea={idea} canEdit={false} /> : null}</>
}
