import { apiDelete, apiGet, apiPatch, apiPost, getUrlSearchParams } from '../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { CommentDto, CreateCommentDto, DiscussionDto, EditCommentDto } from './comments.dto'

export const COMMENTS_API_PATH = '/comments'

// GET ALL

async function getComments(discussionDto: DiscussionDto): Promise<CommentDto[]> {
    const queryParams = getUrlSearchParams(discussionDto).toString()
    const result = await apiGet<CommentDto[]>(`${COMMENTS_API_PATH}?${queryParams}`)
    result.sort((a, b) => b.createdAt - a.createdAt)
    return result
}

export const COMMENTS_QUERY_KEY_BASE = 'comments'

export const useGetComments = (discussionDto: DiscussionDto, options?: UseQueryOptions<CommentDto[]>) => {
    return useQuery([COMMENTS_QUERY_KEY_BASE, discussionDto], () => getComments(discussionDto), options)
}

// CREATE

function createComment(dto: CreateCommentDto) {
    return apiPost<CommentDto>(COMMENTS_API_PATH, dto)
}

export const useCreateComment = () => {
    return useMutation(createComment)
}

// PATCH

function editComment({ id, ...dto }: EditCommentDto) {
    return apiPatch<CommentDto>(`${COMMENTS_API_PATH}/${id}`, dto)
}

export function useEditComment() {
    return useMutation(editComment)
}

// DELETE
export interface DeleteCommentParams {
    id: string
}

function deleteComment({ id }: DeleteCommentParams): Promise<void> {
    return apiDelete(`${COMMENTS_API_PATH}/${id}`)
}

export const useDeleteComment = () => {
    return useMutation(deleteComment)
}
