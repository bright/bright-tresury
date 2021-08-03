import React from 'react'
import { useTranslation } from 'react-i18next'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            whiteSpace: 'nowrap',
        },
    }),
)

interface OwnProps {
    differenceBetweenDatesInDays: number
}

export type IdeaMilestoneDateRangeDifferenceProps = OwnProps

const MilestoneDateRangeDifference = ({ differenceBetweenDatesInDays }: IdeaMilestoneDateRangeDifferenceProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            {differenceBetweenDatesInDays > 1 ? (
                <>
                    {differenceBetweenDatesInDays} {t('common.dateTime.days')}
                </>
            ) : (
                <>
                    {differenceBetweenDatesInDays} {t('common.dateTime.day')}
                </>
            )}
        </div>
    )
}

export default MilestoneDateRangeDifference
