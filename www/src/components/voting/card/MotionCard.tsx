import { Paper, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import Divider from '../../divider/Divider'
import { MotionDto, MotionStatus } from '../motion.dto'
import MotionDetails from './details/MotionDetails'
import Header from './header/Header'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default,
            width: '500px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            margin: '5px 0px',
        },
    }),
)

interface OwnProps {
    motion: MotionDto
}

export type MotionCardProps = OwnProps

const MotionCard = ({ motion }: MotionCardProps) => {
    const styles = useStyles()
    return (
        <Paper className={styles.root}>
            <Header motion={motion} />
            <Divider />
            {motion.status === MotionStatus.Proposed ? <MotionDetails ayes={motion.ayes} nays={motion.nays} /> : null}
        </Paper>
    )
}
export default MotionCard
