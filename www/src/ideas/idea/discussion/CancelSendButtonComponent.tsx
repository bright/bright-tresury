import React from 'react'
import { Button } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
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
    return (
        <div className={styles.root}>
            <Button onClick={onCancelClick}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={onSendClick}>
                Send
            </Button>
        </div>
    )
}
export default CancelSendButtonsComponent
