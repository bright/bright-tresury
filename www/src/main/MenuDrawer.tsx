import React, {useState} from "react";
import {MenuItem} from "./MenuItems";
import clsx from "clsx";
import {createStyles, Drawer, isWidthDown, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {WithWidthProps} from "@material-ui/core/withWidth/withWidth";
import MenuItemsList from "./MenuItemsList";

const useStyles = makeStyles((theme: Theme) => {
        const drawerWidth = 250
        const miniDrawerWidth = 84
        return createStyles({
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

interface Props {
    currentItem: MenuItem,
    onItemSelected: (item: MenuItem) => void
}

const MenuDrawer: React.FC<WithWidthProps & Props> = ({width, currentItem, onItemSelected}) => {
    const classes = useStyles()
    const isTabletOrMobile = () => isWidthDown(breakpoints.tablet, width!)
    // const [drawerState, setDrawerState] = useState(!isTabletOrMobile())
    const [drawerState, setDrawerState] = useState(true)

    const container =
        window !== undefined ? () => window.document.body : undefined;

    return <Drawer
        onTouchStart={() => {
            if (isTabletOrMobile()) {
                setDrawerState(!drawerState)
            }
        }}
        container={container}
        onClose={() => setDrawerState(false)}
        anchor={'left'}
        className={clsx({
            [classes.drawerOpen]: drawerState,
            [classes.drawerClose]: !drawerState
        })}
        classes={{
            paper: clsx({
                [classes.drawerOpen]: drawerState,
                [classes.drawerClose]: !drawerState
            })
        }}
        variant="permanent">
        <MenuItemsList currentItem={currentItem} onItemSelected={onItemSelected}/>
    </Drawer>
}

export default MenuDrawer
