import React from 'react'
import { useTranslation } from 'react-i18next'
import { timeToString } from '../../util/dateUtil'
import { Time } from '@polkadot/util/types'
import BaseStatsCard from './BaseStatsCard'

interface OwnProps {
    value: Time
    name: string
    imgSrc: string
}

export type TimeStatsCardProps = OwnProps

const TimeStatsCard = ({ value, name, imgSrc }: TimeStatsCardProps) => {
    const { t } = useTranslation()
    const timeStr = timeToString(value, t)

    return <BaseStatsCard value={timeStr} name={name} imgSrc={imgSrc} />
}

export default TimeStatsCard
