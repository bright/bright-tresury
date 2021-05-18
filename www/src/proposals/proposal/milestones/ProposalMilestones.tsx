import React, { useEffect } from 'react'
import { IdeaMilestones } from '../../../ideas/idea/milestones/IdeaMilestones'
import { useLoading } from '../../../components/loading/LoadingWrapper'
import { getIdea } from '../../../ideas/ideas.api'

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
