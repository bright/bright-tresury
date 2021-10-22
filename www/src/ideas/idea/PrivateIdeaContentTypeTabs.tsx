import React from 'react'
import { useGetIdeaDiscussionAppEvents } from '../../main/top-bar/notifications/app-events.api'
import IdeaContentTypeTabs from './IdeaContentTypeTabs'
import { IdeaTabConfig } from './Idea'

interface OwnProps {
    userId: string
    ideaId: string
    ideaTabsConfig: IdeaTabConfig[]
}

export type PrivateIdeaContentTypeTabsProps = OwnProps

const PrivateIdeaContentTypeTabs = ({ userId, ideaId, ideaTabsConfig }: PrivateIdeaContentTypeTabsProps) => {
    const { data } = useGetIdeaDiscussionAppEvents({
        ideaId,
        userId: userId,
        pageSize: 100,
        pageNumber: 1,
    })
    return <IdeaContentTypeTabs discussionNotificationsCount={data?.total} ideaTabsConfig={ideaTabsConfig} />
}

export default PrivateIdeaContentTypeTabs
