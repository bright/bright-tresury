import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTimeLeft } from '../../../../../util/useTimeLeft'
import { timeToString } from '../../../../../util/dateUtil'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginRight: '10px',
        },
    }),
)

interface OwnProps {
    closes: string
}

export type TippingTimeProps = OwnProps

const TippingTime = ({ closes }: TippingTimeProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { timeLeft } = useTimeLeft(closes)

    return (
        <div className={classes.root}>
            {t('tip.tippers.timeLeft')}
            {timeLeft ? timeToString(timeLeft, t) : null}
        </div>
    )
}
export default TippingTime
