import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MotionDto, MotionStatus } from '../../motion.dto'
import MotionTimeLabel from './MotionTimeLabel'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '14px 0',
        },
    }),
)

interface OwnProps {
    motion: MotionDto
}

export type MotionTimeRowProps = OwnProps

const MotionTimeRow = ({ motion: { motionEnd, motionStart, status } }: MotionTimeRowProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const executed = () => (
        <>
            {motionStart ? <MotionTimeLabel label={t('voting.past.started')} motionTime={motionStart} /> : null}
            {motionEnd ? <MotionTimeLabel label={t('voting.past.ended')} motionTime={motionEnd} /> : null}
        </>
    )

    const proposed = () =>
        motionEnd ? <MotionTimeLabel label={t('voting.future.end')} motionTime={motionEnd} /> : null

    return <div className={classes.root}>{status === MotionStatus.Proposed ? proposed() : executed()}</div>
}
export default MotionTimeRow
