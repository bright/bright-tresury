import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { FormHeader } from './header/FormHeader'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '3em 5em 3em 3em',
            background: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '1em 1.5em 3em 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1em 1.5em 4em 1em',
            },
        },
    }),
)

export interface ContainerProps {
    title?: string
}

const Container: React.FC<ContainerProps> = ({ title, children }) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {title && <FormHeader title={title} />}
            {children}
        </div>
    )
}

export default Container
