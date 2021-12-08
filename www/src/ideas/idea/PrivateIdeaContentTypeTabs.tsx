import React from 'react'
import { useGetIdeaDiscussionAppEvents } from '../../main/top-bar/notifications/app-events.api'
import IdeaContentTypeTabs from './IdeaContentTypeTabs'
import { IdeaContentType, IdeaTabConfig } from './Idea'

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
    const mappedIdeaTabsConfig = ideaTabsConfig.map((ideaTabConfig) => {
        if (ideaTabConfig.ideaContentType !== IdeaContentType.Discussion) return ideaTabConfig
        return { ...ideaTabConfig, notificationsCount: data?.total }
    })

    return <IdeaContentTypeTabs ideaTabsConfig={mappedIdeaTabsConfig} />
}

export default PrivateIdeaContentTypeTabs
