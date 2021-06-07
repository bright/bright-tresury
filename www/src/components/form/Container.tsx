import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, {PropsWithChildren} from 'react'
import { breakpoints } from '../../theme/theme'
import FormHeader from "./header/FormHeader";

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

interface OwnProps {
    title?: string
}

export type ContainerProps = PropsWithChildren<OwnProps>

const Container = ({ title, children }: ContainerProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {title && <FormHeader title={title} />}
            {children}
        </div>
    )
}

export default Container
