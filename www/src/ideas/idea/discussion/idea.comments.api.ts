import { apiGet, apiPost } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { IdeaCommentDto, CreateIdeaCommentDto } from './idea.comment.dto'
import { IDEAS_API_PATH } from '../../ideas.api'

const getIdeaCommentsApiBasePath = (ideaId: string) => {
    return `${IDEAS_API_PATH}/${ideaId}/comments`
}

// GET ALL

async function getIdeaComments(ideaId: string): Promise<IdeaCommentDto[]> {
    const result = await apiGet<IdeaCommentDto[]>(getIdeaCommentsApiBasePath(ideaId))
    result.sort((a, b) => b.timestamp - a.timestamp)
    return result
}

export const IDEA_COMMENTS_QUERY_KEY_BASE = 'ideaComments'

export const useGetIdeaComments = (ideaId: string, options?: UseQueryOptions<IdeaCommentDto[]>) => {
    return useQuery([IDEA_COMMENTS_QUERY_KEY_BASE, ideaId], () => getIdeaComments(ideaId), options)
}

// CREATE

export interface CreateIdeaCommentParams {
    ideaId: string
    data: CreateIdeaCommentDto
}

function createIdeaComment({ ideaId, data }: CreateIdeaCommentParams) {
    return apiPost<IdeaCommentDto>(`${getIdeaCommentsApiBasePath(ideaId)}`, data)
}

export const useCreateIdeaComment = () => {
    return useMutation(createIdeaComment)
}
