import { ProposalDto } from '../../proposals.api'
import { useEffect, useState, useMemo, useCallback } from 'react'
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

    const isDescriptionVisible = useMemo(() => {
        return ideaMilestoneId !== null && ideaMilestoneId !== undefined
    }, [ideaMilestoneId])

    const loadIdea = useCallback((ideaId: string) => {
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
    }, [])

    useEffect(() => {
        if (ideaId) {
            loadIdea(ideaId)
        }
    }, [ideaId])

    useEffect(() => {
        if (ideaMilestoneId) {
            getIdeaMilestone(ideaMilestoneId)
                .then(({ ideaId, description }) => {
                    setValues((prevState) => {
                        return {
                            ...prevState,
                            description,
                        }
                    })
                    loadIdea(ideaId)
                })
                .catch(() => {
                    // TODO: Handle API call error
                })
        }
    }, [ideaMilestoneId])

    return {
        values,
        isDescriptionVisible,
    }
}
