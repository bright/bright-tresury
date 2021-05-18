import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginLeft: '1em',
            color: theme.palette.error.main,
        },
    }),
)

interface Props {
    error: string
}

export const ErrorText = ({ error }: Props) => {
    const classes = useStyles()

    return <p className={classes.root}>{error}</p>
}
