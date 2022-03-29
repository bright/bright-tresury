import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import Modal from '../Modal'

const useStyles = makeStyles(() =>
    createStyles({
        content: {
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    }),
)

interface OwnProps {
    onClose: () => void
}

export type QuestionModalProps = OwnProps & MaterialDialogProps

const QuestionModal = ({ open, onClose, children, ...props }: QuestionModalProps) => {
    const classes = useStyles()

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            fullWidth={true}
            maxWidth={'xs'}
            {...props}
        >
            <div className={classes.content}>{children}</div>
        </Modal>
    )
}

export default QuestionModal
