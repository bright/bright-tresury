import React from 'react'
import { useParams } from 'react-router'
import { useNetworks } from '../../networks/useNetworks'
import LoadingWrapper from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import Tip from './Tip'
import { useGetTip } from '../tips.api'

const TipLoader = () => {
    const { t } = useTranslation()
    let { tipHash } = useParams<{ tipHash: string }>()
    const { network } = useNetworks()
    const { status, data: tip } = useGetTip({ tipHash, network: network.id })

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingTip')}
            loadingText={t('loading.tip')}
        >
            {tip && <Tip tip={tip} />}
        </LoadingWrapper>
    )
}

export default TipLoader
