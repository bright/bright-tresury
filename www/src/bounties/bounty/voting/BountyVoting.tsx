import React from 'react'
import { BountyDto } from '../../bounties.dto'
import Motions from '../../../components/voting/Motions'
import { useGetBountyVoting } from '../../bounties.api'
import { useNetworks } from '../../../networks/useNetworks'
import { useParams } from 'react-router'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import NoBountyMotion from './NoBountyMotion'

export interface BountyVotingProps {
    bounty: BountyDto
}

const BountyVoting = ({ bounty }: BountyVotingProps) => {
    let { bountyIndex } = useParams<{ bountyIndex: string }>()
    const { network } = useNetworks()
    const { t } = useTranslation()
    const { status, data: bountyVoting } = useGetBountyVoting({ bountyIndex, network: network.id })
    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingBountiesVoting')}
            loadingText={t('loading.bountiesVoting')}
        >
            {bountyVoting?.length ? (
                <Motions motions={bountyVoting} />
            ) : (
                <NoBountyMotion blockchainIndex={bounty.blockchainIndex} />
            )}
        </LoadingWrapper>
    )
}

export default BountyVoting
