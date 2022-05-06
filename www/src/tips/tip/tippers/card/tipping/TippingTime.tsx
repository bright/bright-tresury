import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import BN from 'bn.js'
import { extractTime } from '@polkadot/util'
import { ApiPromise } from '@polkadot/api'
import { timeToString } from '../../../../../util/dateUtil'
import { useSubstrate } from '../../../../../substrate-lib/api/SubstrateContext'
import { useNetworks } from '../../../../../networks/useNetworks'
import { TipDto, TipStatus } from '../../../../tips.dto'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginRight: '10px',
        },
    }),
)

interface BlockchainTimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
    milliseconds: number
}

interface OwnProps {
    tip: TipDto
}

export type TippingTimeProps = OwnProps

const TippingTime = ({ tip }: TippingTimeProps) => {
    const { api } = useSubstrate()
    const context = useNetworks()
    const [time, setTime] = useState('')
    const { t } = useTranslation()
    const classes = useStyles()

    const timeLeft = async () => {
        const blocksToTime = (networkName: string, numberOfBlocks: BN): BlockchainTimeLeft => {
            const milliseconds = numberOfBlocks.mul(getBlockTime(api!)).toNumber()
            return extractTime(Math.abs(milliseconds))
        }

        const getBlockTime = (api: ApiPromise) => {
            const DEFAULT_TIME = new BN(6000) // 6s - Source: https://wiki.polkadot.network/docs/en/faq#what-is-the-block-time-of-the-relay-chain

            return (
                api?.consts.babe?.expectedBlockTime ||
                api?.consts.difficulty?.targetBlockTime ||
                api?.consts.timestamp?.minimumPeriod.muln(2) ||
                DEFAULT_TIME
            )
        }
        const spendPeriodAsObject = tip.closes ? new BN(tip.closes) : null
        const bestNumber = await api?.derive.chain.bestNumber().then((data) => {
            return data
        })
        const numberOfUsedBlocks = spendPeriodAsObject && bestNumber && bestNumber.mod(spendPeriodAsObject)
        const blocksLeft = spendPeriodAsObject && spendPeriodAsObject.sub(numberOfUsedBlocks!)

        return blocksToTime(context.network.id, blocksLeft!)
    }

    const timePromise = timeLeft()

    timePromise.then(function (result) {
        setTime(timeToString(result, t))
    })

    return (
        <div className={classes.root}>
            {t('tip.tippers.timeLeft')}
            {tip.closes && tip.status === TipStatus.Closing ? time : '0'}
        </div>
    )
}
export default TippingTime
