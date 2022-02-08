import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        error: {
            color: theme.palette.error.main,
            textAlign: 'center',
        },
    }),
)

interface OwnProps {
    isError: boolean
    error: string
}

export type QuestionModalErrorProps = OwnProps

const QuestionModalError = ({ isError, error }: QuestionModalErrorProps) => {
    const classes = useStyles()

    return isError ? (
        <p className={classes.error} id="modal-error">
            {error}
        </p>
    ) : null
}

export default QuestionModalError
