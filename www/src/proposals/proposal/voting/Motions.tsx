import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MotionCard from './MotionCard'
import React from 'react'
import { ProposalMotion } from '../../proposals.dto'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: '505px',
            minWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'spaceBetween',
        },
    }),
)

export interface MotionsProp {
    motions: ProposalMotion[]
}

const Motions = ({ motions }: MotionsProp) => {
    const styles = useStyles()
    const successfullyLoadedItemStyles = useSuccessfullyLoadedItemStyles()
    return (
        <div className={`${styles.root} ${successfullyLoadedItemStyles.content}`}>
            {motions.map((motion) => (
                <MotionCard key={motion.hash} motion={motion} />
            ))}
        </div>
    )
}

export default Motions
