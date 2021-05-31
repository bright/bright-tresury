import React from 'react'
import { Divider } from '../../../components/divider/Divider'
import MotionHeader from './MotionHeader'
import MotionDetails from './MotionDetails'
import { Paper, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { ProposalMotion } from '../../proposals.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            margin: '5px 0px',
        },
    }),
)

export interface MotionCardProps {
    motion: ProposalMotion
}

const MotionCard = ({ motion }: MotionCardProps) => {
    const { method, ayes, nays, motionEnd } = motion
    const styles = useStyles()
    return (
        <Paper className={styles.root}>
            <MotionHeader method={method} motionEnd={motionEnd} ayesCount={ayes?.length} naysCount={nays?.length} />
            <Divider />
            <MotionDetails ayes={ayes} nays={nays} />
        </Paper>
    )
}
export default MotionCard
