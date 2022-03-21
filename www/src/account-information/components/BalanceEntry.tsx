import BN from 'bn.js'
import { toFixedDecimals, toNetworkDisplayValue } from '../../util/quota.util'
import { NetworkPlanckValue } from '../../util/types'
import { useNetworks } from '../../networks/useNetworks'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import IdentityEntry from './IdentityEntry'
import { ClassNameProps } from '../../components/props/className.props'

interface OwnProps {
    title: string
    amount?: BN
}

export type BalanceEntryProps = OwnProps & ClassNameProps

const BalanceEntry = ({ title, amount, className }: BalanceEntryProps) => {
    const { network } = useNetworks()
    const { t } = useTranslation()
    const value = useMemo(
        () =>
            amount
                ? toFixedDecimals(toNetworkDisplayValue(amount.toString() as NetworkPlanckValue, network.decimals), 4)
                : t('common.na'),
        [amount, network],
    )
    return <IdentityEntry title={title} value={value} className={className} />
}
export default BalanceEntry
