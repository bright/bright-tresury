import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginLeft: '1em',
        },
    }),
)

interface Props {
    message: string
}

export const ErrorMessage = ({ message }: Props) => {
    const classes = useStyles()

    return <p className={classes.root}>{message}</p>
}
