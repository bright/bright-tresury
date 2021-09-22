import React from 'react'
import Select from './Select'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontWeight: 600,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '32px',
            },
        },
    }),
)

export const TimeSelect: React.FC = () => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <Select
            className={classes.root}
            value={t('components.timeSelect.currentSpendTime')}
            options={[t('components.timeSelect.currentSpendTime')]}
        />
    )
}
