import React from 'react'
import { IdeaMilestones } from '../../../ideas/idea/milestones/IdeaMilestones'
import { useIdea } from '../../../ideas/idea/useIdea'

export interface ProposalMilestonesProps {
    ideaId: string
}

export const ProposalMilestones = ({ ideaId }: ProposalMilestonesProps) => {
    const { idea, canEdit } = useIdea(ideaId)

    return <>{idea ? <IdeaMilestones idea={idea} canEdit={canEdit} displayWithinIdeaSubTab={false} /> : null}</>
}
