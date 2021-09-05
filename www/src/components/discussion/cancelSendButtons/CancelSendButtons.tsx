import React from 'react'
import { Button } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Nil } from '../../../util/types'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '12px',
        },
        button: {
            fontSize: '14px',
            fontWeight: 600,
        },
        cancel: {
            color: theme.palette.primary.main,
        },
        error: {
            color: theme.palette.error.main,
            margin: 'auto 12px',
            fontSize: '14px',
            fontWeight: 600,
        },
    }),
)
interface OwnProps {
    onCancelClick: () => any
    onSendClick: () => any
    error?: Nil<string>
}
export type CancelSendButtonsProps = OwnProps
const CancelSendButtons = ({ onCancelClick, onSendClick, error }: CancelSendButtonsProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    return (
        <div className={classes.root}>
            {error ? <span className={classes.error}>{error}</span> : null}
            <Button onClick={onCancelClick} className={clsx(classes.button, classes.cancel)}>
                {t('discussion.cancelComment')}
            </Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={onSendClick}>
                {t('discussion.sendComment')}
            </Button>
        </div>
    )
}
export default CancelSendButtons
