import React from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../../../networks/useNetworks'
import LoadingWrapper from '../../../../components/loading/LoadingWrapper'
import ChildBounty from './ChildBounty'
import { useGetChildBounty } from '../child-bounties.api'
import { useGetBountyCurator } from '../../../bounties.api'

const ChildBountyLoader = () => {
    const { t } = useTranslation()
    let { childBountyIndex } = useParams<{ childBountyIndex: string }>()
    let { bountyIndex } = useParams<{ bountyIndex: string }>()

    const { network } = useNetworks()
    const { status: getChildBountyStatus, data: childBounty } = useGetChildBounty({
        bountyIndex,
        childBountyIndex,
        network: network.id,
    })
    const { status: getBountyCuratorStatus, data: bountyCurator } = useGetBountyCurator({
        bountyIndex,
        network: network.id,
    })
    return (
        <LoadingWrapper
            status={getChildBountyStatus}
            errorText={t('errors.errorOccurredWhileLoadingChildBounty')}
            loadingText={t('loading.childBounty')}
        >
            <LoadingWrapper
                status={getBountyCuratorStatus}
                errorText={t('errors.errorOccurredWhileLoadingBountyCurator')}
                loadingText={t('loading.bountyCurator')}
            >
                {childBounty ? <ChildBounty bountyCurator={bountyCurator} childBounty={childBounty} /> : null}
            </LoadingWrapper>
        </LoadingWrapper>
    )
}

export default ChildBountyLoader
