import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useGetComments } from '../../../discussion/comments.api'
import { IdeaDiscussionDto } from '../../../discussion/comments.dto'
import {
    IDEA_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE,
    UNREAD_APP_EVENTS_QUERY_KEY_BASE,
    useGetIdeaDiscussionAppEvents,
    useReadAppEvents,
} from '../../../main/top-bar/notifications/app-events.api'
import { IdeaDto } from '../../ideas.dto'
import PublicIdeaDiscussion from './PublicIdeaDiscussion'

interface OwnProps {
    idea: IdeaDto
    discussion: IdeaDiscussionDto
    userId: string
}
export type PrivateIdeaDiscussionProps = OwnProps

const PrivateIdeaDiscussion = ({ idea, discussion, userId }: PrivateIdeaDiscussionProps) => {
    const ideaComments = useGetComments(discussion)
    const appEvents = useGetIdeaDiscussionAppEvents({
        ideaId: discussion.entityId,
        userId: userId,
        pageSize: 100,
        pageNumber: 1,
    })
    const { mutateAsync } = useReadAppEvents()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!ideaComments.isSuccess || !appEvents.isSuccess) {
            return
        }
        const appEventIds = appEvents.data.items
            .filter((appEvent) => ideaComments.data.find((comment) => comment.id === appEvent.data.commentId))
            .map((appEvents) => appEvents.id)
        if (appEventIds.length === 0) {
            return
        }
        mutateAsync(
            { userId, appEventIds },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries([IDEA_DISCUSSION_APP_EVENTS_QUERY_KEY_BASE])
                    await queryClient.invalidateQueries([UNREAD_APP_EVENTS_QUERY_KEY_BASE])
                },
            },
        )
    }, [appEvents.isSuccess, appEvents.data, ideaComments.isSuccess, ideaComments.data])

    return <PublicIdeaDiscussion idea={idea} discussion={discussion} />
}
export default PrivateIdeaDiscussion
