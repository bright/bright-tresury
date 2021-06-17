import React, { PropsWithChildren, useMemo, useState } from 'react'
import clsx from 'clsx'
import { createStyles, Drawer, isWidthDown, Theme, withWidth } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import { WithWidthProps } from '@material-ui/core/withWidth/withWidth'
import MenuItemsList from './MenuItemsList'
import expandMenu from '../../assets/expand_menu.svg'
import collapseMenu from '../../assets/collapse_menu.svg'
import IconButton from '../../components/button/IconButton'
import MenuAppInfo from './MenuAppInfo'
import { DESKTOP_TOP_BAR_HEIGHT, TABLET_TOP_BAR_HEIGHT } from '../top-bar/TopBar'

const useStyles = makeStyles((theme: Theme) => {
    const drawerWidth = 250
    const miniDrawerWidth = 84
    return createStyles({
        root: {
            marginTop: DESKTOP_TOP_BAR_HEIGHT,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginTop: TABLET_TOP_BAR_HEIGHT,
            },
            background: theme.palette.background.default,
        },
        paper: {
            paddingBottom: DESKTOP_TOP_BAR_HEIGHT,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                paddingBottom: TABLET_TOP_BAR_HEIGHT,
            },
        },
        drawerIcon: {
            marginTop: '1em',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: miniDrawerWidth,
        },
    })
})

export type MenuDrawerProps = WithWidthProps

const MenuDrawer = ({ width }: MenuDrawerProps) => {
    const classes = useStyles()
    const isTabletOrMobile = useMemo(() => isWidthDown(breakpoints.tablet, width!), [width])
    const [open, setOpen] = useState(!isTabletOrMobile)

    const closeDrawer = () => {
        setOpen(false)
    }

    return (
        <Drawer
            onClose={closeDrawer}
            anchor={'left'}
            open
            className={clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx(classes.root, classes.paper, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
            variant="permanent"
        >
            {isTabletOrMobile ? (
                <IconButton
                    className={classes.drawerIcon}
                    svg={open ? collapseMenu : expandMenu}
                    onClick={() => setOpen(!open)}
                />
            ) : null}
            <MenuItemsList />
            {!isTabletOrMobile ? <MenuAppInfo /> : null}
        </Drawer>
    )
}

export default withWidth()(MenuDrawer)
