import React from 'react'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'

import { IdeaContentType, IdeaTabConfig } from './Idea'

interface OwnProps {
    discussionNotificationsCount?: number
    ideaTabsConfig: IdeaTabConfig[]
}

export type IdeaContentTypeTabsProps = OwnProps

const IdeaContentTypeTabs = ({ discussionNotificationsCount = 0, ideaTabsConfig }: IdeaContentTypeTabsProps) => {
    const getNotificationsCount = (ideaContentType: IdeaContentType): number => {
        switch (ideaContentType) {
            case IdeaContentType.Discussion:
                return discussionNotificationsCount
            default:
                return 0
        }
    }

    const tabEntries: TabEntry[] = ideaTabsConfig.map((ideaTabConfig) => ({
        label: ideaTabConfig.translation,
        path: ideaTabConfig.url,
        svg: ideaTabConfig.svg,
        filterName: '',
        notificationsCount: getNotificationsCount(ideaTabConfig.ideaContentType),
    }))

    return (
        <div>
            <Tabs values={tabEntries} />
        </div>
    )
}

export default IdeaContentTypeTabs
