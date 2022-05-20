import React from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../../networks/useNetworks'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import ChildBounty from './ChildBounty'
import { useGetChildBounty } from './child-bounties.api'

const ChildBountyLoader = () => {
    const { t } = useTranslation()
    let { childBountyIndex } = useParams<{ childBountyIndex: string }>()
    let { bountyIndex } = useParams<{ bountyIndex: string }>()
    const { network } = useNetworks()
    const { status, data: childBounty } = useGetChildBounty({ bountyIndex, childBountyIndex, network: network.id })

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingChildBounty')}
            loadingText={t('loading.childBounty')}
        >
            {childBounty ? <ChildBounty childBounty={childBounty} /> : null}
        </LoadingWrapper>
    )
}

export default ChildBountyLoader
