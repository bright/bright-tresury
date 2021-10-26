import React from 'react'
import { useTranslation } from 'react-i18next'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'

import { IdeaContentType, IdeaTabConfig } from './Idea'
import { useRouteMatch } from 'react-router-dom'

interface OwnProps {
    discussionNotificationsCount?: number
    ideaTabsConfig: IdeaTabConfig[]
}

export type IdeaContentTypeTabsProps = OwnProps

const IdeaContentTypeTabs = ({ discussionNotificationsCount = 0, ideaTabsConfig }: IdeaContentTypeTabsProps) => {
    const { t } = useTranslation()
    const { url } = useRouteMatch()
    const getNotificationsCount = (ideaContentType: IdeaContentType): number => {
        switch (ideaContentType) {
            case IdeaContentType.Discussion:
                return discussionNotificationsCount
            default:
                return 0
        }
    }

    const tabEntries: TabEntry[] = ideaTabsConfig.map((ideaTabConfig) => ({
        label: t(ideaTabConfig.translationKey),
        path: ideaTabConfig.getUrl(url),
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
