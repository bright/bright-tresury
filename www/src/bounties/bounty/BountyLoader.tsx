import React from 'react'
import { useParams } from 'react-router'
import { useNetworks } from '../../networks/useNetworks'
import { useGetBounty } from '../bounties.api'
import LoadingWrapper from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import Bounty from './Bounty'

const BountyLoader = () => {
    const { t } = useTranslation()
    let { bountyIndex } = useParams<{ bountyIndex: string }>()
    const { network } = useNetworks()
    const { status, data: bounty } = useGetBounty({ bountyIndex, network: network.id })

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingBounty')}
            loadingText={t('loading.bounty')}
        >
            {bounty ? <Bounty bounty={bounty} /> : null}
        </LoadingWrapper>
    )
}

export default BountyLoader
