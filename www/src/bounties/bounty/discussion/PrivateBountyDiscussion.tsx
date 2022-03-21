import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useGetComments } from '../../../discussion/comments.api'
import { BountyDiscussionDto } from '../../../discussion/comments.dto'
import Discussion from '../../../discussion/Discussion'
import {
    BOUNTY_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE,
    UNREAD_APP_EVENTS_QUERY_KEY_BASE,
    useGetBountyDiscussionAppEvents,
    useReadAppEvents,
} from '../../../main/top-bar/notifications/app-events.api'
import { BountyDto } from '../../bounties.dto'

interface OwnProps {
    discussion: BountyDiscussionDto
    bounty: BountyDto
    userId: string
}
export type PrivateBountyDiscussionProps = OwnProps

const PrivateBountyDiscussion = ({
    discussion,
    discussion: { blockchainIndex: bountyIndex, networkId },
    bounty,
    userId,
}: PrivateBountyDiscussionProps) => {
    const bountyComments = useGetComments(discussion)
    const appEvents = useGetBountyDiscussionAppEvents({
        bountyIndex,
        networkId,
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

    return <Discussion discussion={discussion} discussedEntity={bounty} />
}
export default PrivateBountyDiscussion
