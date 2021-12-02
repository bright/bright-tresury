import React from 'react'
import { useTranslation } from 'react-i18next'
import DisplayComment from '../../../components/discussion/displayComment/DisplayComment'
import { BOUNTY_COMMENTS_QUERY_KEY_BASE, useDeleteBountyComment, useEditBountyComment } from './bounty.comments.api'
import { useQueryClient } from 'react-query'
import { CommentDto } from '../../../components/discussion/comment.dto'
import { useNetworks } from '../../../networks/useNetworks'

interface OwnProps {
    bountyIndex: number
    comment: CommentDto
}
export type DisplayBountyCommentProps = OwnProps

const DisplayBountyComment = ({ bountyIndex, comment }: DisplayBountyCommentProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const {
        mutateAsync: deleteBountyComment,
        isError: isDeleteBountyCommentError,
        reset: deleteReset,
        isLoading: deleteIsLoading,
    } = useDeleteBountyComment()
    const {
        mutateAsync: editBountyComment,
        isError: isEditBountyCommentError,
        reset: editReset,
        isLoading: editIsLoading,
    } = useEditBountyComment()
    const queryClient = useQueryClient()

    const deleteComment = async () => {
        await deleteBountyComment(
            { bountyIndex, commentId: comment.id, network: network.id },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([BOUNTY_COMMENTS_QUERY_KEY_BASE, bountyIndex, network.id])
                    editReset()
                },
            },
        )
    }

    const editComment = async (commentContent: string) => {
        const editBountyCommentDto = {
            content: commentContent,
        }
        await editBountyComment(
            { bountyIndex, commentId: comment.id, network: network.id, data: editBountyCommentDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([BOUNTY_COMMENTS_QUERY_KEY_BASE, bountyIndex, network.id])
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
            editError={isEditBountyCommentError ? t('discussion.editError') : undefined}
            deleteComment={deleteComment}
            deleteError={isDeleteBountyCommentError ? t('discussion.deleteError') : undefined}
            isLoading={deleteIsLoading || editIsLoading}
        />
    )
}
export default DisplayBountyComment
