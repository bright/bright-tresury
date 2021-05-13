import React from 'react'
import { IdeaMilestones } from '../../../ideas/idea/milestones/IdeaMilestones'
import { useProposalMilestones } from './useProposalMilestones'

interface Props {
    ideaId: string
}

export const ProposalMilestones = ({ ideaId }: Props) => {
    const { idea } = useProposalMilestones(ideaId)

    return <>{idea ? <IdeaMilestones idea={idea} canEdit={false} /> : null}</>
}
