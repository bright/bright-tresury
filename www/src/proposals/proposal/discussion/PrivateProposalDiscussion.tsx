import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import {
    PROPOSAL_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE,
    UNREAD_APP_EVENTS_QUERY_KEY_BASE,
    useGetProposalDiscussionAppEvents,
    useReadAppEvents,
} from '../../../main/top-bar/notifications/app-events.api'
import { useNetworks } from '../../../networks/useNetworks'
import { useGetProposalComments } from './proposal.comments.api'
import PublicProposalDiscussion from './PublicProposalDiscussion'

interface OwnProps {
    proposalIndex: number
    userId: string
}
export type PrivateProposalDiscussionProps = OwnProps

const PrivateProposalDiscussion = ({ proposalIndex, userId }: PrivateProposalDiscussionProps) => {
    const { network } = useNetworks()
    const proposalComments = useGetProposalComments(proposalIndex, network.id)
    const appEvents = useGetProposalDiscussionAppEvents({
        proposalIndex,
        networkId: network.id,
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

    return <PublicProposalDiscussion proposalIndex={proposalIndex} />
}
export default PrivateProposalDiscussion
