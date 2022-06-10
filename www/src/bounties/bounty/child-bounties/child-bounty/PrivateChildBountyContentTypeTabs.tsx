import React from 'react'
import ChildBountyContentTypeTabs from './header/ChildBountyContentTypeTabs'
import { useNetworks } from '../../../../networks/useNetworks'
import { useGetChildBountyDiscussionAppEvents } from '../../../../main/top-bar/notifications/app-events.api'
import { ChildBountyContentType, ChildBountyTabConfig } from './ChildBounty'

interface OwnProps {
    userId: string
    blockchainIndex: number
    parentBountyBlockchainIndex: number
    childBountyTabsConfig: ChildBountyTabConfig[]
}

export type PrivateBountyContentTypeTabsProps = OwnProps

const PrivateChildBountyContentTypeTabs = ({
    userId,
    parentBountyBlockchainIndex,
    blockchainIndex,
    childBountyTabsConfig,
}: PrivateBountyContentTypeTabsProps) => {
    const { network } = useNetworks()
    const { data } = useGetChildBountyDiscussionAppEvents({
        childBountyIndex: blockchainIndex,
        bountyIndex: parentBountyBlockchainIndex,
        networkId: network.id,
        userId: userId,
        pageSize: 100,
        pageNumber: 1,
    })

    const mappedTabsConfig = childBountyTabsConfig.map((tabConfig) => {
        if (tabConfig.childBountyContentType !== ChildBountyContentType.Discussion) return tabConfig
        return { ...tabConfig, notificationsCount: data?.total }
    })

    return <ChildBountyContentTypeTabs childBountyTabsConfig={mappedTabsConfig} />
}

export default PrivateChildBountyContentTypeTabs
