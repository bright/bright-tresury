import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { Nil } from '../../../util/types'
import Button from '../../button/Button'

const useStyles = makeStyles(() =>
    createStyles({
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
            paddingRight: '5px',
            paddingLeft: '5px',
            paddingTop: '30px',
        },
    }),
)

interface OwnProps {
    onClose: () => void
    onSubmit: () => void
    discardLabel: string
    submitLabel: string
    disabled?: Nil<boolean>
}

export type QuestionModalButtonsProps = OwnProps

const QuestionModalButtons = ({
    onClose,
    onSubmit,
    discardLabel,
    submitLabel,
    disabled,
}: QuestionModalButtonsProps) => {
    const classes = useStyles()

    return (
        <div className={classes.buttons}>
            <Button variant="text" color="primary" onClick={onClose} disabled={!!disabled}>
                {discardLabel}
            </Button>
            <Button color="primary" onClick={onSubmit} disabled={!!disabled}>
                {submitLabel}
            </Button>
        </div>
    )
}

export default QuestionModalButtons
