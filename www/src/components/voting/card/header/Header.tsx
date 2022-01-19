import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import CardHeader from '../../../card/components/CardHeader'
import { MotionDto, MotionStatus } from '../../motion.dto'
import MotionTimeRow from './MotionTimeRow'
import MotionStatusLabel from './MotionStatusLabel'
import MotionTitle from './MotionTitle'
import VoteCount from './VoteCount'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0px 16px 8px 16px',
            width: '100%',
            fontSize: '18px',
        },
        upperRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
        },
    }),
)

interface OwnProps {
    motion: MotionDto
}

export type MotionHeaderProps = OwnProps

const Header = ({ motion }: MotionHeaderProps) => {
    const styles = useStyles()

    return (
        <CardHeader>
            <div className={styles.root}>
                <div className={styles.upperRow}>
                    <MotionTitle method={motion.method} />
                    <div>
                        {motion.status === MotionStatus.Proposed ? (
                            <VoteCount ayes={motion.ayes} nays={motion.nays} />
                        ) : (
                            <MotionStatusLabel status={motion.status} />
                        )}
                    </div>
                </div>
                <MotionTimeRow motion={motion} />
            </div>
        </CardHeader>
    )
}
export default Header
