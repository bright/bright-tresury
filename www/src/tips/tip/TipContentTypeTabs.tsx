import React from 'react'
import { useTranslation } from 'react-i18next'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'
import { useRouteMatch } from 'react-router-dom'
import { TipTabConfig } from './Tip'

interface OwnProps {
    tipTabsConfig: TipTabConfig[]
}

export type TipContentTypeTabsProps = OwnProps

const TipContentTypeTabs = ({ tipTabsConfig }: TipContentTypeTabsProps) => {
    const { t } = useTranslation()
    const { url } = useRouteMatch()

    const tabEntries: TabEntry[] = tipTabsConfig.map((tipTabConfig) => ({
        label: t(tipTabConfig.translationKey),
        path: tipTabConfig.getUrl(url),
        svg: tipTabConfig.svg,
        filterName: tipTabConfig.tipContentType,
        notificationsCount: tipTabConfig.notificationsCount ?? 0,
        isDefault: tipTabConfig.isDefault,
    }))

    return (
        <div>
            <Tabs values={tabEntries} />
        </div>
    )
}

export default TipContentTypeTabs
