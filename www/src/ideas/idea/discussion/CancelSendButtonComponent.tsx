import React from 'react'
import { Button } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
    }),
)
interface OwnProps {
    onCancelClick: () => void
    onSendClick: () => void
}
export type CancelSendButtonComponentProps = OwnProps
const CancelSendButtonsComponent = ({ onCancelClick, onSendClick }: CancelSendButtonComponentProps) => {
    const styles = useStyles()
    const { t } = useTranslation()
    return (
        <div className={styles.root}>
            <Button onClick={onCancelClick}>{t('idea.discussion.cancelComment')}</Button>
            <Button variant="contained" color="primary" onClick={onSendClick}>
                {t('idea.discussion.sendComment')}
            </Button>
        </div>
    )
}
export default CancelSendButtonsComponent
