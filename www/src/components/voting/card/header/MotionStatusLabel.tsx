import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MotionStatus } from '../../motion.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        green: {
            color: theme.palette.success.main,
        },
        red: {
            color: theme.palette.error.main,
        },
    }),
)

interface OwnProps {
    status: MotionStatus
}

export type MotionStatusLabelProps = OwnProps

const MotionStatusLabel = ({ status }: MotionStatusLabelProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const renderStatus = () => {
        switch (status) {
            case MotionStatus.Approved:
                return <span className={classes.green}>{t('voting.status.approved')}</span>
            case MotionStatus.Disapproved:
                return <span className={classes.red}>{t('voting.status.disapproved')}</span>
        }
    }

    return <strong>{renderStatus()}</strong>
}
export default MotionStatusLabel
