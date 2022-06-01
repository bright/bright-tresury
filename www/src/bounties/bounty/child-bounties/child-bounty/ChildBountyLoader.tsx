import React from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../../../networks/useNetworks'
import LoadingWrapper from '../../../../components/loading/LoadingWrapper'
import ChildBounty from './ChildBounty'
import { useGetChildBounty } from '../child-bounties.api'
import { useGetBounty } from '../../../bounties.api'
import { reduceStatusList } from '../../../../components/loading/loader.utils'

const ChildBountyLoader = () => {
    const { t } = useTranslation()
    let { childBountyIndex } = useParams<{ childBountyIndex: string }>()
    let { bountyIndex } = useParams<{ bountyIndex: string }>()
    const { network } = useNetworks()
    const { status: getBountyStatus, data: bounty } = useGetBounty({ bountyIndex, network: network.id })
    const { status: getChildBountyStatus, data: childBounty } = useGetChildBounty({
        bountyIndex,
        childBountyIndex,
        network: network.id,
    })
    return (
        <LoadingWrapper
            status={reduceStatusList([getBountyStatus, getChildBountyStatus])}
            errorText={t('errors.errorOccurredWhileLoadingChildBounty')}
            loadingText={t('loading.childBounty')}
        >
            {bounty && childBounty ? <ChildBounty childBounty={childBounty} bounty={bounty} /> : null}
        </LoadingWrapper>
    )
}

export default ChildBountyLoader
