import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useGetComments } from '../../../discussion/comments.api'
import { ProposalDiscussionDto } from '../../../discussion/comments.dto'
import Discussion from '../../../discussion/Discussion'
import {
    PROPOSAL_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE,
    UNREAD_APP_EVENTS_QUERY_KEY_BASE,
    useGetProposalDiscussionAppEvents,
    useReadAppEvents,
} from '../../../main/top-bar/notifications/app-events.api'

interface OwnProps {
    discussion: ProposalDiscussionDto
    userId: string
}
export type PrivateProposalDiscussionProps = OwnProps

const PrivateProposalDiscussion = ({
    discussion,
    discussion: { blockchainIndex: proposalIndex, networkId },
    userId,
}: PrivateProposalDiscussionProps) => {
    const proposalComments = useGetComments(discussion)
    const appEvents = useGetProposalDiscussionAppEvents({
        proposalIndex,
        networkId,
        userId,
        pageSize: 100,
        pageNumber: 1,
    })
    const { mutateAsync } = useReadAppEvents()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!proposalComments.isSuccess || !appEvents.isSuccess) {
            return
        }
        const appEventIds = appEvents.data.items
            .filter((appEvent) => proposalComments.data.find((comment) => comment.id === appEvent.data.commentId))
            .map((appEvents) => appEvents.id)
        if (appEventIds.length === 0) {
            return
        }
        mutateAsync(
            { userId, appEventIds },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries([PROPOSAL_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE])
                    await queryClient.invalidateQueries([UNREAD_APP_EVENTS_QUERY_KEY_BASE])
                },
            },
        )
    }, [appEvents.isSuccess, appEvents.data, proposalComments.isSuccess, proposalComments.data])

    return <Discussion discussion={discussion} />
}
export default PrivateProposalDiscussion
