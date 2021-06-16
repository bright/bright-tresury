import React from 'react'
import IdeaMilestones from '../../../ideas/idea/milestones/IdeaMilestones'
import { useIdea } from '../../../ideas/idea/useIdea'

export interface OwnProps {
    ideaId: string
}

export type ProposalMilestonesProps = OwnProps

const ProposalMilestones = ({ ideaId }: ProposalMilestonesProps) => {
    const { idea, canEdit } = useIdea(ideaId)

    return <>{idea ? <IdeaMilestones idea={idea} canEdit={canEdit} displayWithinIdeaSubTab={false} /> : null}</>
}

export default ProposalMilestones
