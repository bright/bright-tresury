import { apiDelete, apiGet, apiPatch, apiPost } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { IdeaCommentDto, CreateIdeaCommentDto, UpdateIdeaCommentDto } from './idea.comment.dto'
import { IDEAS_API_PATH } from '../../ideas.api'

const getIdeaCommentsApiBasePath = (ideaId: string) => {
    return `${IDEAS_API_PATH}/${ideaId}/comments`
}

// GET ALL

async function getIdeaComments(ideaId: string): Promise<IdeaCommentDto[]> {
    const result = await apiGet<IdeaCommentDto[]>(getIdeaCommentsApiBasePath(ideaId))
    result.sort((a, b) => b.createdAt - a.createdAt)
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

export interface UpdateIdeaCommentParams {
    ideaId: string
    commentId: string
    data: UpdateIdeaCommentDto
}

function updateIdeaComment({ ideaId, commentId, data }: UpdateIdeaCommentParams) {
    return apiPatch<IdeaCommentDto>(`${getIdeaCommentsApiBasePath(ideaId)}/${commentId}`, data)
}

export function useUpdateIdeaComment() {
    return useMutation(updateIdeaComment)
}

// DELETE
export interface DeleteIdeaCommentParams {
    ideaId: string
    commentId: string
}

function deleteIdeaComment({ ideaId, commentId }: DeleteIdeaCommentParams): Promise<void> {
    return apiDelete(`${getIdeaCommentsApiBasePath(ideaId)}/${commentId}`)
}

export const useDeleteIdeaComment = () => {
    return useMutation(deleteIdeaComment)
}
