import { ProposalDto } from '../../proposals.api'
import { useEffect, useState } from 'react'
import { getIdea } from '../../../ideas/ideas.api'
import { getIdeaMilestone } from '../../../ideas/idea/milestones/idea.milestones.api'
import { Nil } from '../../../util/types'

export interface ProposalInfoValues {
    proposer: string
    field?: string
    reason?: string
    description?: Nil<string>
}

export const useProposalInfo = ({ ideaId, ideaMilestoneId, proposer }: ProposalDto) => {
    const [values, setValues] = useState<ProposalInfoValues>({
        proposer,
        field: '',
        reason: '',
        description: '',
    })

    useEffect(() => {
        if (ideaId) {
            getIdea(ideaId)
                .then(({ field, content }) => {
                    setValues((prevState) => {
                        return {
                            ...prevState,
                            field,
                            reason: content,
                        }
                    })
                })
                .catch(() => {
                    // TODO: Handle API call error
                })
        }
    }, [ideaId])

    useEffect(() => {
        if (ideaId && ideaMilestoneId) {
            getIdeaMilestone(ideaId, ideaMilestoneId)
                .then(({ description }) => {
                    setValues((prevState) => {
                        return {
                            ...prevState,
                            description,
                        }
                    })
                })
                .catch(() => {
                    // TODO: Handle API call error
                })
        }
    }, [ideaId, ideaMilestoneId])

    return {
        values,
    }
}
