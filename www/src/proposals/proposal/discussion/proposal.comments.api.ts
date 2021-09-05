import { apiDelete, apiGet, apiPatch, apiPost } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { PROPOSALS_API_PATH } from '../../proposals.api'
import { CommentDto, CreateCommentDto, EditCommentDto } from '../../../components/discussion/comment.dto'

const getProposalCommentsApiBasePath = (proposalIndex: number) => {
    return `${PROPOSALS_API_PATH}/${proposalIndex}/comments`
}

// GET ALL

async function getProposalComments(proposalIndex: number, network: string): Promise<CommentDto[]> {
    const result = await apiGet<CommentDto[]>(`${getProposalCommentsApiBasePath(proposalIndex)}?network=${network}`)
    result.sort((a, b) => b.createdAt - a.createdAt)
    return result
}

export const PROPOSAL_COMMENTS_QUERY_KEY_BASE = 'proposalComments'

export const useGetProposalComments = (
    proposalIndex: number,
    network: string,
    options?: UseQueryOptions<CommentDto[]>,
) => {
    return useQuery(
        [PROPOSAL_COMMENTS_QUERY_KEY_BASE, proposalIndex],
        () => getProposalComments(proposalIndex, network),
        options,
    )
}

// CREATE

export interface CreateProposalCommentParams {
    proposalIndex: number
    network: string
    data: CreateCommentDto
}

function createProposalComment({ proposalIndex, network, data }: CreateProposalCommentParams) {
    return apiPost<CommentDto>(`${getProposalCommentsApiBasePath(proposalIndex)}`, { ...data, network })
}

export const useCreateProposalComment = () => {
    return useMutation(createProposalComment)
}

// PATCH

export interface EditProposalCommentParams {
    proposalIndex: number
    network: string
    commentId: string
    data: EditCommentDto
}

function editProposalComment({ proposalIndex, commentId, network, data }: EditProposalCommentParams) {
    return apiPatch<CommentDto>(`${getProposalCommentsApiBasePath(proposalIndex)}/${commentId}`, { ...data, network })
}

export function useEditProposalComment() {
    return useMutation(editProposalComment)
}

// DELETE
export interface DeleteProposalCommentParams {
    proposalIndex: number
    commentId: string
}

function deleteProposalComment({ proposalIndex, commentId }: DeleteProposalCommentParams): Promise<void> {
    return apiDelete(`${getProposalCommentsApiBasePath(proposalIndex)}/${commentId}`)
}

export const useDeleteProposalComment = () => {
    return useMutation(deleteProposalComment)
}
