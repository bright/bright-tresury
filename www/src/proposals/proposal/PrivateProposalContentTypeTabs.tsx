import React from 'react'
import { useGetProposalDiscussionAppEvents } from '../../main/top-bar/notifications/app-events.api'
import { useNetworks } from '../../networks/useNetworks'
import { ProposalContentType, ProposalContentTypeTabs } from './ProposalContentTypeTabs'
import { ProposalTabConfig } from './Proposal'

interface OwnProps {
    userId: string
    proposalIndex: number
    proposalTabsConfig: ProposalTabConfig[]
}

export type PrivateProposalContentTypeTabsProps = OwnProps

const PrivateProposalContentTypeTabs = ({
    userId,
    proposalIndex,
    proposalTabsConfig,
}: PrivateProposalContentTypeTabsProps) => {
    const { network } = useNetworks()
    const { data } = useGetProposalDiscussionAppEvents({
        proposalIndex,
        networkId: network.id,
        userId: userId,
        pageSize: 100,
        pageNumber: 1,
    })
    proposalTabsConfig = proposalTabsConfig.map((proposalTabConfig) => {
        if (proposalTabConfig.proposalContentType !== ProposalContentType.Discussion) return proposalTabConfig
        return { ...proposalTabConfig, notificationsCount: data?.total }
    })

    return <ProposalContentTypeTabs proposalTabsConfig={proposalTabsConfig} />
}

export default PrivateProposalContentTypeTabs
