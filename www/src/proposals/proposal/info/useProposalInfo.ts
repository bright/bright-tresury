import { ProposalDto } from '../../proposals.dto'
import { useEffect, useState } from 'react'
import { getIdea, useGetIdea } from '../../../ideas/ideas.api'
import { getIdeaMilestone } from '../../../ideas/idea/milestones/idea.milestones.api'
import { Nil } from '../../../util/types'

export const useProposalInfo = ({ ideaId, ideaMilestoneId }: ProposalDto) => {
    const [field, setField] = useState<string | undefined>('')
    const [reason, setReason] = useState<string | undefined>('')
    const [description, setDescription] = useState<Nil<string>>('')

    // const { data: idea } = useGetIdea(ideaId!)
    //
    // useEffect(() => {
    //     if (ideaId) {
    //         getIdea(ideaId)
    //             .then(({ field, content }) => {
    //                 setField(field)
    //                 setReason(content)
    //             })
    //             .catch(() => {
    //                 // TODO: Handle API call error
    //             })
    //     }
    // }, [ideaId])
    //
    // useEffect(() => {
    //     if (ideaId && ideaMilestoneId) {
    //         getIdeaMilestone(ideaId, ideaMilestoneId)
    //             .then(({ description }) => {
    //                 setDescription(description)
    //             })
    //             .catch(() => {
    //                 // TODO: Handle API call error
    //             })
    //     }
    // }, [ideaId, ideaMilestoneId])

    return {
        field,
        reason,
        description,
    }
}
