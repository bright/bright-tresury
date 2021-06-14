import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginLeft: '1em',
            fontSize: '16px',
            color: theme.palette.error.main,
        },
    }),
)

export interface ErrorProps {
    text: string
}

const Error = ({ text }: ErrorProps) => {
    const classes = useStyles()

    return <p className={classes.root}>{text}</p>
}

export default Error
