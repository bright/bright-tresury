import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { ChildBountyDiscussionDto } from '../../../../../discussion/comments.dto'
import { ChildBountyDto } from '../../child-bounties.dto'
import { useGetComments } from '../../../../../discussion/comments.api'
import {
    CHILD_BOUNTY_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE,
    UNREAD_APP_EVENTS_QUERY_KEY_BASE,
    useGetChildBountyDiscussionAppEvents,
    useReadAppEvents,
} from '../../../../../main/top-bar/notifications/app-events.api'
import Discussion from '../../../../../discussion/Discussion'

interface OwnProps {
    discussion: ChildBountyDiscussionDto
    childBounty: ChildBountyDto
    userId: string
}
export type PrivateChildBountyDiscussionProps = OwnProps

const PrivateChildBountyDiscussion = ({
    discussion,
    discussion: { blockchainIndex, networkId },
    childBounty,
    userId,
}: PrivateChildBountyDiscussionProps) => {
    const childBountyComments = useGetComments(discussion)
    const appEvents = useGetChildBountyDiscussionAppEvents({
        childBountyIndex: blockchainIndex,
        bountyIndex: childBounty.parentBountyBlockchainIndex,
        networkId,
        userId,
        pageSize: 100,
        pageNumber: 1,
    })
    const { mutateAsync } = useReadAppEvents()
    const queryClient = useQueryClient()

    useEffect(() => {
        // debugger
        if (!childBountyComments.isSuccess || !appEvents.isSuccess) {
            return
        }
        const appEventIds = appEvents.data.items
            .filter((appEvent) => childBountyComments.data.find((comment) => comment.id === appEvent.data.commentId))
            .map((appEvents) => appEvents.id)
        if (appEventIds.length === 0) {
            return
        }
        mutateAsync(
            { userId, appEventIds },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries([CHILD_BOUNTY_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE])
                    await queryClient.invalidateQueries([UNREAD_APP_EVENTS_QUERY_KEY_BASE])
                },
            },
        )
    }, [appEvents.isSuccess, appEvents.data, childBountyComments.isSuccess, childBountyComments.data])

    return <Discussion discussion={discussion} discussedEntity={childBounty} />
}
export default PrivateChildBountyDiscussion
