import React from 'react'
import { useGetIdeaDiscussionAppEvents } from '../../main/top-bar/notifications/app-events.api'
import IdeaContentTypeTabs from './IdeaContentTypeTabs'

interface OwnProps {
    userId: string
    ideaId: string
}

export type PrivateIdeaContentTypeTabsProps = OwnProps

const PrivateIdeaContentTypeTabs = ({ userId, ideaId }: PrivateIdeaContentTypeTabsProps) => {
    const { data } = useGetIdeaDiscussionAppEvents({
        ideaId,
        userId: userId,
        pageSize: 100,
        pageNumber: 1,
    })
    return <IdeaContentTypeTabs discussionNotificationsCount={data?.total} />
}

export default PrivateIdeaContentTypeTabs
