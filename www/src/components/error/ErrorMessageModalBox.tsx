import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import { Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F9D6DC',
            color: '#FF0100',
            fontSize: '16px',
            fontWeight: 700,
            borderRadius: '8px',
            padding: '.5em 2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '.35em 2em',
                // marginBottom: '20px',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '.6em 2em',
            },
        },
    }),
)

interface Props {
    message: string
}

export const ErrorMessageModalBox = ({ message }: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <span>{message}</span>
        </div>
    )
}
