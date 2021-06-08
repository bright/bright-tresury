import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginLeft: '2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '1em',
            },
        },
    }),
)

export const Status: React.FC = ({ children }) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}
