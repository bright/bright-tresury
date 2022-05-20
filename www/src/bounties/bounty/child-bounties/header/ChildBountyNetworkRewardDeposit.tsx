import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChildBountyDto } from '../child-bounties.dto'
import { NetworkPlanckValue } from '../../../../util/types'
import NetworkRewardDeposit from '../../../../components/network/NetworkRewardDeposit'

interface Value {
    value: NetworkPlanckValue
    label: string
}

interface OwnProps {
    childBounty: ChildBountyDto
}
export type ChildBountyNetworkRewardDepositProps = OwnProps
const ChildBountyNetworkRewardDeposit = ({ childBounty }: ChildBountyNetworkRewardDepositProps) => {
    const { t } = useTranslation()

    const values: Value[] = []

    values.push({ value: childBounty.curatorDeposit, label: t('childBounty.info.curatorDeposit') })
    values.push({ value: childBounty.fee, label: t('childBounty.info.curatorsFee') })
    values.push({ value: childBounty.value, label: t('childBounty.info.reward') })

    return <NetworkRewardDeposit values={values} />
}
export default ChildBountyNetworkRewardDeposit
