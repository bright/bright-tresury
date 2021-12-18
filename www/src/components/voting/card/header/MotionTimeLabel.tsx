import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { timeToString } from '../../../../util/dateUtil'
import { formatNumber } from '../../../../util/numberUtil'
import { MotionTimeDto, MotionTimeType } from '../../motion.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontSize: 12,
            fontWeight: theme.typography.fontWeightRegular,
        },
        label: {
            color: theme.palette.text.disabled,
        },
    }),
)

interface OwnProps {
    label: string
    motionTime: MotionTimeDto
}

export type MotionTimeLabelProps = OwnProps

const MotionTimeLabel = ({ label, motionTime }: MotionTimeLabelProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const blockNo = `#${formatNumber(motionTime.blockNo)}`
    const time = timeToString(motionTime.time, t)

    return (
        <div className={classes.root}>
            <span className={classes.label}>{`${label} - `}</span>
            <span>{`${time} (${blockNo})`}</span>
            {motionTime.type === MotionTimeType.Past ? <span className={classes.label}>{` ${t('ago')}`}</span> : null}
        </div>
    )
}
export default MotionTimeLabel
