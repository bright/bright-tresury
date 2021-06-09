import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

import { breakpoints } from '../theme/theme'
import TopBar, { DESKTOP_TOP_BAR_HEIGHT, TABLET_TOP_BAR_HEIGHT } from './top-bar/TopBar'
import Menu from './menu/Menu'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dashboard: {
            minHeight: '100%',
            marginTop: DESKTOP_TOP_BAR_HEIGHT,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginTop: TABLET_TOP_BAR_HEIGHT,
            },
            display: 'flex',
            flexDirection: 'row',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column',
            },
            backgroundColor: theme.palette.background.paper,
        },
        content: {
            overflow: 'hidden',
            width: '100%',
        },
    }),
)

const Main: React.FC = ({ children }) => {
    const classes = useStyles()

    return (
        <>
            <TopBar />
            <div className={classes.dashboard}>
                <Menu />
                <div className={classes.content}>{children}</div>
            </div>
        </>
    )
}

export default Main
