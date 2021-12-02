import { apiDelete, apiGet, apiPatch, apiPost } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { BOUNTIES_API_PATH } from '../../bounties.api'
import { CommentDto, CreateCommentDto, EditCommentDto } from '../../../components/discussion/comment.dto'

const getBountyCommentsApiBasePath = (bountyIndex: number, networkId: string, commentId: string = '') => {
    return `${BOUNTIES_API_PATH}/${bountyIndex}/comments/${commentId}?network=${networkId}`
}

// GET ALL

async function getBountyComments(bountyIndex: number, network: string): Promise<CommentDto[]> {
    const result = await apiGet<CommentDto[]>(`${getBountyCommentsApiBasePath(bountyIndex, network)}`)
    result.sort((a, b) => b.createdAt - a.createdAt)
    return result
}

export const BOUNTY_COMMENTS_QUERY_KEY_BASE = 'bountyComments'

export const useGetBountyComments = (bountyIndex: number, network: string, options?: UseQueryOptions<CommentDto[]>) => {
    return useQuery(
        [BOUNTY_COMMENTS_QUERY_KEY_BASE, bountyIndex, network],
        () => getBountyComments(bountyIndex, network),
        options,
    )
}

// CREATE

export interface CreateBountyCommentParams {
    bountyIndex: number
    network: string
    data: CreateCommentDto
}

function createBountyComment({ bountyIndex, network, data }: CreateBountyCommentParams) {
    return apiPost<CommentDto>(`${getBountyCommentsApiBasePath(bountyIndex, network)}`, data)
}

export const useCreateBountyComment = () => {
    return useMutation(createBountyComment)
}

// PATCH

export interface EditBountyCommentParams {
    bountyIndex: number
    network: string
    commentId: string
    data: EditCommentDto
}

function editBountyComment({ bountyIndex, commentId, network, data }: EditBountyCommentParams) {
    return apiPatch<CommentDto>(getBountyCommentsApiBasePath(bountyIndex, network, commentId), data)
}

export function useEditBountyComment() {
    return useMutation(editBountyComment)
}

// DELETE
export interface DeleteBountyCommentParams {
    bountyIndex: number
    network: string
    commentId: string
}

function deleteBountyComment({ bountyIndex, commentId, network }: DeleteBountyCommentParams): Promise<void> {
    return apiDelete(getBountyCommentsApiBasePath(bountyIndex, network, commentId))
}

export const useDeleteBountyComment = () => {
    return useMutation(deleteBountyComment)
}
