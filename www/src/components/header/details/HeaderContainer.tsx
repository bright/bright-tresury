import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: theme.palette.background.default,
            padding: '32px 32px 24px 32px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '24px 2.2em 24px 2.2em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
    }),
)

export const HeaderContainer: React.FC = ({ children }) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}
