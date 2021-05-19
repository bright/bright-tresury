import React from 'react'
import { IdeaMilestones } from '../../../ideas/idea/milestones/IdeaMilestones'
import { useGetIdea } from '../../../ideas/ideas.api'

interface Props {
    ideaId: string
}

export const ProposalMilestones = ({ ideaId }: Props) => {
    const { data: idea } = useGetIdea(ideaId)

    return <>{idea ? <IdeaMilestones idea={idea} canEdit={false} /> : null}</>
}
