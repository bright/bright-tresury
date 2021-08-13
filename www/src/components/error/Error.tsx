import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { ClassNameProps } from '../props/className.props'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginLeft: '1em',
            fontSize: '16px',
            color: theme.palette.error.main,
        },
    }),
)

interface OwnProps {
    text: string
}

export type ErrorProps = OwnProps & ClassNameProps

const Error = ({ text, className }: ErrorProps) => {
    const classes = useStyles()
    return <p className={clsx(classes.root, className)}>{text}</p>
}

export default Error
