import React from 'react'
import { useTranslation } from 'react-i18next'
import EnterComment from '../../../components/discussion/enterComment/EnterComment'
import { useQueryClient } from 'react-query'
import { useNetworks } from '../../../networks/useNetworks'
import { BOUNTY_COMMENTS_QUERY_KEY_BASE, useCreateBountyComment } from './bounties.comments.api'

interface OwnProps {
    bountyIndex: number
}
export type EnterBountyCommentProps = OwnProps

const EnterBountyComment = ({ bountyIndex }: EnterBountyCommentProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { mutateAsync: createBountyComment, isError, reset } = useCreateBountyComment()

    const queryClient = useQueryClient()
    const onSendClick = async (content: string) => {
        const data = { content }

        await createBountyComment(
            { bountyIndex, network: network.id, data },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([BOUNTY_COMMENTS_QUERY_KEY_BASE, bountyIndex])
                },
            },
        )
    }

    return (
        <EnterComment
            onSendClick={onSendClick}
            onCancelClick={reset}
            error={isError ? t('discussion.sendCommentError') : null}
        />
    )
}
export default EnterBountyComment
