import React from 'react'
import { useTranslation } from 'react-i18next'
import EnterComment from '../../../components/discussion/enterComment/EnterComment'
import { PROPOSAL_COMMENTS_QUERY_KEY_BASE, useCreateProposalComment } from './proposal.comments.api'
import { useQueryClient } from 'react-query'
import { CreateCommentDto } from '../../../components/discussion/comment.dto'
import { useNetworks } from '../../../networks/useNetworks'

interface OwnProps {
    proposalIndex: number
}
export type EnterProposalCommentProps = OwnProps

const EnterProposalComment = ({ proposalIndex }: EnterProposalCommentProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { mutateAsync: createProposalComment, isError, reset } = useCreateProposalComment()

    const queryClient = useQueryClient()
    const onSendClick = async (commentContent: string) => {
        const ideaCommentDto = {
            content: commentContent,
        } as CreateCommentDto

        await createProposalComment(
            { proposalIndex, network: network.id, data: ideaCommentDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([PROPOSAL_COMMENTS_QUERY_KEY_BASE, proposalIndex])
                },
            },
        )
    }

    return (
        <EnterComment
            onSendClick={onSendClick}
            onCancelClick={reset}
            error={isError ? t('discussion.sendCommentError') : undefined}
        />
    )
}
export default EnterProposalComment
