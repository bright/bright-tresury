import React, {useMemo, useState} from "react";
import clsx from "clsx";
import {createStyles, Drawer, isWidthDown, Theme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {WithWidthProps} from "@material-ui/core/withWidth/withWidth";
import MenuItemsList from "./MenuItemsList";
import treasuryLogo from "./../assets/treasury_logo.svg"
import {IconButton} from "../components/button/IconButton";
import MenuAppInfo from "./MenuAppInfo";

const useStyles = makeStyles((theme: Theme) => {
        const drawerWidth = 250
        const miniDrawerWidth = 84
        return createStyles({
            root: {
                background: theme.palette.background.default
            },
            drawerIcon: {
                marginTop: '1em'
            },
            drawerOpen: {
                width: drawerWidth,
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen
                })
            },
            drawerClose: {
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen
                }),
                overflowX: "hidden",
                width: miniDrawerWidth,
            },
        })
    }
)

const MenuDrawer: React.FC<WithWidthProps> = ({width}) => {
    const classes = useStyles()
    const isTabletOrMobile = useMemo(() => isWidthDown(breakpoints.tablet, width!), [width])
    const [open, setOpen] = useState(!isTabletOrMobile)

    const container =
        window !== undefined ? () => window.document.body : undefined;

    const closeDrawer = () => {
        setOpen(false)
    }

    return <Drawer
        container={container}
        onClose={closeDrawer}
        anchor={'left'}
        open
        className={clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
        })}
        classes={{
            paper: clsx(classes.root, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open
            })
        }}
        variant="permanent">
        {isTabletOrMobile ?
            <IconButton className={classes.drawerIcon} svg={treasuryLogo} onClick={() => setOpen(!open)}/>
            : null
        }
        <MenuItemsList/>
        {!isTabletOrMobile ? <MenuAppInfo/> : null}
    </Drawer>
}

export default withWidth()(MenuDrawer)
