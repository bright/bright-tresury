import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        noComments: {
            fontSize: '16px',
        },
    }),
)

const NoComments = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    return <p className={classes.noComments}>{t('discussion.noComments')}</p>
}
export default NoComments
