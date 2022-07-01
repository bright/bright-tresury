import { createStyles, makeStyles } from '@material-ui/core/styles'
import CardHeader from '../../../card/components/CardHeader'
import { MotionDto, MotionStatus } from '../../motion.dto'
import MotionTimeRow from './MotionTimeRow'
import MotionStatusLabel from './MotionStatusLabel'
import MotionTitle from './MotionTitle'
import VoteCount from './VoteCount'
import InformationTip from '../../../info/InformationTip'
import { Trans, useTranslation } from 'react-i18next'
import Strong from '../../../strong/Strong'
import React from 'react'

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
        informationTip: {
            marginTop: '14px',
            fontSize: '12px',
            fontWeight: 400,
        },
    }),
)

interface OwnProps {
    motion: MotionDto
}

export type MotionHeaderProps = OwnProps

const Header = ({ motion }: MotionHeaderProps) => {
    const styles = useStyles()
    const { t } = useTranslation()
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
                <InformationTip
                    className={styles.informationTip}
                    label={<Trans i18nKey="voting.informationTip" values={{ motionThreshold: motion.threshold }} />}
                />
                <MotionTimeRow motion={motion} />
            </div>
        </CardHeader>
    )
}
export default Header
