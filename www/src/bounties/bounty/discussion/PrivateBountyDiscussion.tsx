import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import {
    BOUNTY_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE,
    UNREAD_APP_EVENTS_QUERY_KEY_BASE,
    useGetBountyDiscussionAppEvents,
    useReadAppEvents,
} from '../../../main/top-bar/notifications/app-events.api'
import { useNetworks } from '../../../networks/useNetworks'
import { useGetBountyComments } from './bounty.comments.api'
import PublicBountyDiscussion from './PublicBountyDiscussion'

interface OwnProps {
    bountyIndex: number
    userId: string
}
export type PrivateBountyDiscussionProps = OwnProps

const PrivateBountyDiscussion = ({ bountyIndex, userId }: PrivateBountyDiscussionProps) => {
    const { network } = useNetworks()
    const bountyComments = useGetBountyComments(bountyIndex, network.id)
    const appEvents = useGetBountyDiscussionAppEvents({
        bountyIndex,
        networkId: network.id,
        userId,
        pageSize: 100,
        pageNumber: 1,
    })
    const { mutateAsync } = useReadAppEvents()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!bountyComments.isSuccess || !appEvents.isSuccess) {
            return
        }
        const appEventIds = appEvents.data.items
            .filter((appEvent) => bountyComments.data.find((comment) => comment.id === appEvent.data.commentId))
            .map((appEvents) => appEvents.id)
        if (appEventIds.length === 0) {
            return
        }
        mutateAsync(
            { userId, appEventIds },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries([BOUNTY_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE])
                    await queryClient.invalidateQueries([UNREAD_APP_EVENTS_QUERY_KEY_BASE])
                },
            },
        )
    }, [appEvents.isSuccess, appEvents.data, bountyComments.isSuccess, bountyComments.data])

    return <PublicBountyDiscussion bountyIndex={bountyIndex} />
}
export default PrivateBountyDiscussion
