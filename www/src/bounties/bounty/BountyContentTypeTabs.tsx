import React from 'react'
import { useTranslation } from 'react-i18next'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'
import { BountyTabConfig } from './Bounty'
import { useRouteMatch } from 'react-router-dom'

interface OwnProps {
    bountyTabsConfig: BountyTabConfig[]
}

export type BountyContentTypeTabsProps = OwnProps

const BountyContentTypeTabs = ({ bountyTabsConfig }: BountyContentTypeTabsProps) => {
    const { t } = useTranslation()
    const { url } = useRouteMatch()

    const tabEntries: TabEntry[] = bountyTabsConfig.map((bountyTabConfig) => ({
        label: t(bountyTabConfig.translationKey),
        path: bountyTabConfig.getUrl(url),
        svg: bountyTabConfig.svg,
        filterName: bountyTabConfig.bountyContentType,
        notificationsCount: bountyTabConfig.notificationsCount ?? 0,
        isDefault: bountyTabConfig.isDefault,
    }))

    return (
        <div>
            <Tabs values={tabEntries} />
        </div>
    )
}

export default BountyContentTypeTabs
