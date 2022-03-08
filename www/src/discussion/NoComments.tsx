import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() =>
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
