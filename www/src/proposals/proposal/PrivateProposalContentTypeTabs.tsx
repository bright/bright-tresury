import React from 'react'
import { useGetProposalDiscussionAppEvents } from '../../main/top-bar/notifications/app-events.api'
import { useNetworks } from '../../networks/useNetworks'
import { ProposalContentTypeTabs } from './ProposalContentTypeTabs'

interface OwnProps {
    userId: string
    proposalIndex: number
}

export type PrivateProposalContentTypeTabsProps = OwnProps

const PrivateProposalContentTypeTabs = ({ userId, proposalIndex }: PrivateProposalContentTypeTabsProps) => {
    const { network } = useNetworks()
    const { data } = useGetProposalDiscussionAppEvents({
        proposalIndex,
        networkId: network.id,
        userId: userId,
        pageSize: 100,
        pageNumber: 1,
    })
    return <ProposalContentTypeTabs discussionNotificationsCount={data?.total} />
}

export default PrivateProposalContentTypeTabs
