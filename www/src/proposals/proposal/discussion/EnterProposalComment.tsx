import React from 'react'
import { useTranslation } from 'react-i18next'
import EnterComment from '../../../components/discussion/enterComment/EnterComment'
import { PROPOSAL_COMMENTS_QUERY_KEY_BASE, useCreateProposalComment } from './proposal.comments.api'
import { useQueryClient } from 'react-query'
import { useNetworks } from '../../../networks/useNetworks'

interface OwnProps {
    proposalIndex: number
}
export type EnterProposalCommentProps = OwnProps

const EnterProposalComment = ({ proposalIndex }: EnterProposalCommentProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { mutateAsync: createProposalComment, isError, reset, isLoading } = useCreateProposalComment()

    const queryClient = useQueryClient()
    const onSendClick = async (commentContent: string) => {
        const ideaCommentDto = {
            content: commentContent,
        }

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
            isLoading={isLoading}
        />
    )
}
export default EnterProposalComment
