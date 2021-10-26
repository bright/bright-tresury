import React from 'react'
import { useTranslation } from 'react-i18next'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'

import { IdeaTabConfig } from './Idea'
import { useRouteMatch } from 'react-router-dom'

interface OwnProps {
    ideaTabsConfig: IdeaTabConfig[]
}

export type IdeaContentTypeTabsProps = OwnProps

const IdeaContentTypeTabs = ({ ideaTabsConfig }: IdeaContentTypeTabsProps) => {
    const { t } = useTranslation()
    const { url } = useRouteMatch()

    const tabEntries: TabEntry[] = ideaTabsConfig.map((ideaTabConfig) => ({
        label: t(ideaTabConfig.translationKey),
        path: ideaTabConfig.getUrl(url),
        svg: ideaTabConfig.svg,
        filterName: '',
        notificationsCount: ideaTabConfig.notificationsCount ?? 0,
    }))

    return (
        <div>
            <Tabs values={tabEntries} />
        </div>
    )
}

export default IdeaContentTypeTabs
