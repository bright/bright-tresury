import { useMutation } from 'react-query'
import { apiDelete, apiPost } from '../../../api'
import { COMMENTS_API_PATH } from '../../comments.api'
import { CreateReactionDto, ReactionDto } from './reactions.dto'

const REACTIONS_API_PATH = 'reactions'

// CREATE

export type CreateReactionApiParams = {
    commentId: string
} & CreateReactionDto

function createReaction({ commentId, ...dto }: CreateReactionApiParams) {
    return apiPost<ReactionDto>(`${COMMENTS_API_PATH}/${commentId}/${REACTIONS_API_PATH}`, dto)
}

export const useCreateReaction = () => {
    return useMutation(createReaction)
}

// DELETE
export interface DeleteReactionParams {
    id: string
    commentId: string
}

function deleteReaction({ id, commentId }: DeleteReactionParams): Promise<void> {
    return apiDelete(`${COMMENTS_API_PATH}/${commentId}/${REACTIONS_API_PATH}/${id}`)
}

export const useDeleteReaction = () => {
    return useMutation(deleteReaction)
}
