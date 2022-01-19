import React from 'react'
import { useNetworks } from '../../networks/useNetworks'
import BaseStatsCard from './BaseStatsCard'
import { NetworkDisplayValue } from '../../util/types'
import { toFixedDecimals } from '../../util/quota.util'

interface OwnProps {
    value: NetworkDisplayValue
    name: string
    imgSrc: string
}

export type CurrencyAmountStatsCardProps = OwnProps

const CurrencyAmountStatsCard = ({ value, name, imgSrc }: CurrencyAmountStatsCardProps) => {
    const {
        network: { currency },
    } = useNetworks()
    return <BaseStatsCard value={`${toFixedDecimals(value, 4)} ${currency}`} name={name} imgSrc={imgSrc} />
}

export default CurrencyAmountStatsCard
