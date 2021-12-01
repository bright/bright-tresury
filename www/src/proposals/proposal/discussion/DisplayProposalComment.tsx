import React from 'react'
import { useTranslation } from 'react-i18next'
import DisplayComment from '../../../components/discussion/displayComment/DisplayComment'
import {
    PROPOSAL_COMMENTS_QUERY_KEY_BASE,
    useDeleteProposalComment,
    useEditProposalComment,
} from './proposal.comments.api'
import { useQueryClient } from 'react-query'
import { CommentDto, EditCommentDto } from '../../../components/discussion/comment.dto'
import { useNetworks } from '../../../networks/useNetworks'

interface OwnProps {
    proposalIndex: number
    comment: CommentDto
}
export type DisplayProposalCommentProps = OwnProps

const DisplayProposalComment = ({ proposalIndex, comment }: DisplayProposalCommentProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const {
        mutateAsync: deleteProposalComment,
        isError: isDeleteProposalCommentError,
        reset: deleteReset,
        isLoading: deleteIsLoading,
    } = useDeleteProposalComment()
    const {
        mutateAsync: editProposalComment,
        isError: isEditProposalCommentError,
        reset: editReset,
        isLoading: editIsLoading,
    } = useEditProposalComment()
    const queryClient = useQueryClient()
    const deleteComment = async () => {
        await deleteProposalComment(
            { proposalIndex, commentId: comment.id },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([PROPOSAL_COMMENTS_QUERY_KEY_BASE, proposalIndex])
                    editReset()
                },
            },
        )
    }

    const editComment = async (commentContent: string) => {
        const editProposalCommentDto = {
            content: commentContent,
        }
        await editProposalComment(
            { proposalIndex, commentId: comment.id, network: network.id, data: editProposalCommentDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([PROPOSAL_COMMENTS_QUERY_KEY_BASE, proposalIndex])
                    deleteReset()
                },
            },
        )
    }

    return (
        <DisplayComment
            comment={comment}
            cancelEditComment={editReset}
            saveEditComment={editComment}
            editError={isEditProposalCommentError ? t('discussion.editError') : undefined}
            deleteComment={deleteComment}
            deleteError={isDeleteProposalCommentError ? t('discussion.deleteError') : undefined}
            isLoading={deleteIsLoading || editIsLoading}
        />
    )
}
export default DisplayProposalComment
