import React from 'react'
import { useTranslation } from 'react-i18next'
import NetworkRewardDeposit from '../../components/network/NetworkRewardDeposit'
import { NetworkPlanckValue } from '../../util/types'
import { BountyDto, BountyStatus } from '../bounties.dto'

interface Value {
    value: NetworkPlanckValue
    label: string
}

interface OwnProps {
    bounty: BountyDto
}
export type NetworkRewardDepositProps = OwnProps
const ProposalNetworkRewardDeposit = ({ bounty }: NetworkRewardDepositProps) => {
    const { t } = useTranslation()

    const values: Value[] = []

    // reward
    values.push({ value: bounty.value, label: t('bounty.info.reward') })

    if (
        bounty.status === BountyStatus.Proposed ||
        bounty.status === BountyStatus.Approved ||
        bounty.status === BountyStatus.Funded ||
        bounty.status === BountyStatus.Rejected
    ) {
        values.push({ value: bounty.bond, label: t('bounty.info.bond') })
    }

    if (
        bounty.status === BountyStatus.CuratorProposed ||
        bounty.status === BountyStatus.Active ||
        bounty.status === BountyStatus.PendingPayout
    ) {
        values.push({ value: bounty.curatorDeposit, label: t('bounty.info.curatorsDeposit') })
    }

    if (
        bounty.status === BountyStatus.Active ||
        bounty.status === BountyStatus.PendingPayout ||
        bounty.status === BountyStatus.Claimed
    ) {
        values.push({ value: bounty.curatorFee, label: t('bounty.info.curatorFee') })
    }

    return <NetworkRewardDeposit values={values} />
}
export default ProposalNetworkRewardDeposit
