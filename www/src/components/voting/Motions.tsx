import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MotionCard from './card/MotionCard'
import React from 'react'
import { useSuccessfullyLoadedItemStyles } from '../loading/useSuccessfullyLoadedItemStyles'
import { MotionDto } from './motion.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'spaceBetween',
        },
    }),
)

interface OwnProps {
    motions: MotionDto[]
}

export type MotionsProps = OwnProps

const Motions = ({ motions }: MotionsProps) => {
    const styles = useStyles()
    const successfullyLoadedItemStyles = useSuccessfullyLoadedItemStyles()
    if (!motions) {
        return null
    }
    return (
        <div className={`${styles.root} ${successfullyLoadedItemStyles.content}`}>
            {motions.map((motion) => (
                <MotionCard key={motion.hash} motion={motion} />
            ))}
        </div>
    )
}

export default Motions
