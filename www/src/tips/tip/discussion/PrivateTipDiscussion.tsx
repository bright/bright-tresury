import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import Discussion from '../../../discussion/Discussion'
import { TipDiscussionDto } from '../../../discussion/comments.dto'
import { TipDto } from '../../tips.dto'
import { useGetComments } from '../../../discussion/comments.api'
import {
    TIP_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE,
    UNREAD_APP_EVENTS_QUERY_KEY_BASE,
    useGetTipDiscussionAppEvents,
    useReadAppEvents,
} from '../../../main/top-bar/notifications/app-events.api'

interface OwnProps {
    discussion: TipDiscussionDto
    tip: TipDto
    userId: string
}
export type PrivateTipDiscussionProps = OwnProps

const PrivateTipDiscussion = ({
    discussion,
    discussion: { blockchainHash: tipHash, networkId },
    tip,
    userId,
}: PrivateTipDiscussionProps) => {
    const tipComments = useGetComments(discussion)
    const appEvents = useGetTipDiscussionAppEvents({
        tipHash,
        networkId,
        userId,
        pageSize: 100,
        pageNumber: 1,
    })
    const { mutateAsync } = useReadAppEvents()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!tipComments.isSuccess || !appEvents.isSuccess) {
            return
        }
        const appEventIds = appEvents.data.items
            .filter((appEvent) => tipComments.data.find((comment) => comment.id === appEvent.data.commentId))
            .map((appEvents) => appEvents.id)
        if (appEventIds.length === 0) {
            return
        }
        mutateAsync(
            { userId, appEventIds },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries([TIP_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE])
                    await queryClient.invalidateQueries([UNREAD_APP_EVENTS_QUERY_KEY_BASE])
                },
            },
        )
    }, [appEvents.isSuccess, appEvents.data, tipComments.isSuccess, tipComments.data])

    return <Discussion discussion={discussion} discussedEntity={tip} />
}
export default PrivateTipDiscussion
