import React from 'react'
import { useTranslation } from 'react-i18next'
import { calculateBondValue } from '../../ideas/bondUtil'
import { useNetworks } from '../../networks/useNetworks'
import { NetworkPlanckValue, Nil } from '../../util/types'
import NetworkRewardDeposit from './NetworkRewardDeposit'

interface OwnProps {
    rewardValue: NetworkPlanckValue
    bondValue?: Nil<NetworkPlanckValue>
}
export type NetworkRewardDepositProps = OwnProps
const ProposalNetworkRewardDeposit = ({ rewardValue, bondValue }: NetworkRewardDepositProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()

    let resolvedBondValue = bondValue
    if (!resolvedBondValue) {
        resolvedBondValue = rewardValue
            ? calculateBondValue(
                  rewardValue,
                  network.bond.percentage,
                  network.bond.minValue,
                  network.bond.maxValue,
                  network.version,
              )
            : ('0' as NetworkPlanckValue)
    }

    const values = [
        { value: rewardValue, label: t('idea.content.info.reward') },
        {
            value: resolvedBondValue,
            label: t('idea.content.info.deposit'),
        },
    ]

    return <NetworkRewardDeposit values={values} />
}
export default ProposalNetworkRewardDeposit
