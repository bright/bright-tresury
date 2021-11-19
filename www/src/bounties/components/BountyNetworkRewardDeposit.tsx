import React from 'react'
import { useTranslation } from 'react-i18next'
import NetworkRewardDeposit from '../../components/network/NetworkRewardDeposit'
import { BountyDto, BountyStatus } from '../bounties.dto'

interface OwnProps {
    bounty: BountyDto
}
export type NetworkRewardDepositProps = OwnProps
const ProposalNetworkRewardDeposit = ({ bounty }: NetworkRewardDepositProps) => {
    const { t } = useTranslation()
    debugger
    const reward = { value: bounty.value, label: t('bounty.info.reward') }
    const deposit =
        bounty.status === BountyStatus.CuratorProposed ||
        bounty.status === BountyStatus.Active ||
        bounty.status === BountyStatus.PendingPayout
            ? { value: bounty.curatorFee, label: t('bounty.info.curatorFee') }
            : { value: bounty.bond, label: t('bounty.info.bond') }
    const curatorsDeposit =
        bounty.status === BountyStatus.Active || bounty.status === BountyStatus.PendingPayout
            ? { value: bounty.curatorDeposit, label: t('bounty.info.curatorsDeposit') }
            : null

    const values = [reward, deposit]
    if (curatorsDeposit !== null) {
        values.push(curatorsDeposit)
    }

    return <NetworkRewardDeposit values={values} />
}
export default ProposalNetworkRewardDeposit
