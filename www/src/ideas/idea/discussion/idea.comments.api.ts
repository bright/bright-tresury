import { apiDelete, apiGet, apiPatch, apiPost } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { IDEAS_API_PATH } from '../../ideas.api'
import { CommentDto, CreateCommentDto, EditCommentDto } from '../../../components/discussion/comment.dto'

const getIdeaCommentsApiBasePath = (ideaId: string) => {
    return `${IDEAS_API_PATH}/${ideaId}/comments`
}

// GET ALL

async function getIdeaComments(ideaId: string): Promise<CommentDto[]> {
    const result = await apiGet<CommentDto[]>(getIdeaCommentsApiBasePath(ideaId))
    result.sort((a, b) => b.createdAt - a.createdAt)
    return result
}

export const IDEA_COMMENTS_QUERY_KEY_BASE = 'ideaComments'

export const useGetIdeaComments = (ideaId: string, options?: UseQueryOptions<CommentDto[]>) => {
    return useQuery([IDEA_COMMENTS_QUERY_KEY_BASE, ideaId], () => getIdeaComments(ideaId), options)
}

// CREATE

export interface CreateIdeaCommentParams {
    ideaId: string
    data: CreateCommentDto
}

function createIdeaComment({ ideaId, data }: CreateIdeaCommentParams) {
    return apiPost<CommentDto>(`${getIdeaCommentsApiBasePath(ideaId)}`, data)
}

export const useCreateIdeaComment = () => {
    return useMutation(createIdeaComment)
}

// PATCH

export interface EditIdeaCommentParams {
    ideaId: string
    commentId: string
    data: EditCommentDto
}

function editIdeaComment({ ideaId, commentId, data }: EditIdeaCommentParams) {
    return apiPatch<CommentDto>(`${getIdeaCommentsApiBasePath(ideaId)}/${commentId}`, data)
}

export function useEditIdeaComment() {
    return useMutation(editIdeaComment)
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
