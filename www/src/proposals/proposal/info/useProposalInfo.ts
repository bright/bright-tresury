import { ProposalDto } from '../../proposals.api'
import { useEffect, useState, useMemo } from 'react'
import { getIdeaById, IdeaDto } from '../../../ideas/ideas.api'
import { getIdeaMilestone, IdeaMilestoneDto } from '../../../ideas/idea/milestones/idea.milestones.api'
import { Nil } from '../../../util/types'

export interface ProposalInfoValues {
    proposer: string
    field?: string
    reason?: string
    description?: Nil<string>
}

export const useProposalInfo = ({ ideaId, ideaMilestoneId, proposer }: ProposalDto) => {
    const [ideaToLoadId, setIdeaToLoadId] = useState<string | undefined>(ideaId)

    const [values, setValues] = useState<ProposalInfoValues>({
        proposer,
        field: '',
        reason: '',
        description: '',
    })

    const isDescriptionVisible = useMemo(() => {
        return ideaMilestoneId !== null && ideaMilestoneId !== undefined
    }, [ideaMilestoneId])

    useEffect(() => {
        if (ideaToLoadId) {
            getIdeaById(ideaToLoadId)
                .then(({ field, content }: IdeaDto) => {
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
    }, [ideaToLoadId])

    useEffect(() => {
        if (ideaMilestoneId) {
            getIdeaMilestone(ideaMilestoneId)
                .then(({ ideaId, description }: IdeaMilestoneDto) => {
                    setValues((prevState) => {
                        return {
                            ...prevState,
                            description,
                        }
                    })
                    setIdeaToLoadId(ideaId)
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
