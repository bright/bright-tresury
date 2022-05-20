import React from 'react'
import { useTranslation } from 'react-i18next'

import { useRouteMatch } from 'react-router-dom'
import { ChildBountyTabConfig } from '../ChildBounty'
import Tabs, { TabEntry } from '../../../../../components/tabs/Tabs'

interface OwnProps {
    childBountyTabsConfig: ChildBountyTabConfig[]
}

export type ChildBountyContentTypeTabsProps = OwnProps

const ChildBountyContentTypeTabs = ({ childBountyTabsConfig }: ChildBountyContentTypeTabsProps) => {
    const { t } = useTranslation()
    const { url } = useRouteMatch()

    const tabEntries: TabEntry[] = childBountyTabsConfig.map((childBountyTabConfig) => ({
        label: t(childBountyTabConfig.translationKey),
        path: childBountyTabConfig.getUrl(url),
        svg: childBountyTabConfig.svg,
        filterName: childBountyTabConfig.childBountyContentType,
        notificationsCount: childBountyTabConfig.notificationsCount ?? 0,
        isDefault: childBountyTabConfig.isDefault,
    }))

    return (
        <div>
            <Tabs values={tabEntries} />
        </div>
    )
}

export default ChildBountyContentTypeTabs
