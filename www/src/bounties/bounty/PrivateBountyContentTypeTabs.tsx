import React from 'react'
import { useGetBountyDiscussionAppEvents } from '../../main/top-bar/notifications/app-events.api'
import { useNetworks } from '../../networks/useNetworks'
import { BountyContentType, BountyTabConfig } from './Bounty'
import BountyContentTypeTabs from './BountyContentTypeTabs'

interface OwnProps {
    userId: string
    bountyIndex: number
    bountyTabsConfig: BountyTabConfig[]
}

export type PrivateBountyContentTypeTabsProps = OwnProps

const PrivateBountyContentTypeTabs = ({ userId, bountyIndex, bountyTabsConfig }: PrivateBountyContentTypeTabsProps) => {
    const { network } = useNetworks()
    const { data } = useGetBountyDiscussionAppEvents({
        bountyIndex,
        networkId: network.id,
        userId: userId,
        pageSize: 100,
        pageNumber: 1,
    })

    const mappedTabsConfig = bountyTabsConfig.map((tabConfig) => {
        if (tabConfig.bountyContentType !== BountyContentType.Discussion) return tabConfig
        return { ...tabConfig, notificationsCount: data?.total }
    })

    return <BountyContentTypeTabs bountyTabsConfig={mappedTabsConfig} />
}

export default PrivateBountyContentTypeTabs
