import React from 'react'
import { useNetworks } from '../../networks/useNetworks'
import BaseStatsCard from './BaseStatsCard'

interface OwnProps {
    value: string
    name: string
    imgSrc: string
}

export type BaseStatsCardProps = OwnProps

const CurrencyAmountStatsCard = ({ value, name, imgSrc }: BaseStatsCardProps) => {
    const {
        network: { currency },
    } = useNetworks()

    return <BaseStatsCard value={`${value} ${currency}`} name={name} imgSrc={imgSrc} />
}

export default CurrencyAmountStatsCard
