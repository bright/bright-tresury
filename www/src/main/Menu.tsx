import {
    createStyles, Drawer, isWidthDown,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Theme, withWidth
} from '@material-ui/core';
import React, {useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {MENU_ITEMS} from "./MenuItems";
import {makeStyles} from "@material-ui/core/styles";
import pathToRegexp from "path-to-regexp"
import {breakpoints} from "../theme/theme";
import {WithWidthProps} from "@material-ui/core/withWidth/withWidth";
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
        const drawerWidth = 250
        const miniDrawerWidth = 80
        return createStyles({
            root: {
                width: drawerWidth,
                flexShrink: 0,
            },
            item: {
                display: 'flex',
                padding: '20px 38px',
                [theme.breakpoints.down(breakpoints.tablet)]: {
                    padding: '28px',
                },
            },
            text: {
                fontWeight: 500
            },
            textSelected: {
                fontWeight: 'bold',
            },
            icon: {
                maxHeight: 28,
                width: 22,
                [theme.breakpoints.down(breakpoints.tablet)]: {
                    maxHeight: 28,
                    width: 26
                }
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

const Menu: React.FC<WithWidthProps> = ({width}) => {
    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()
    const {t} = useTranslation()

    const isMobile = () => isWidthDown(breakpoints.mobile, width!)
    const isTabletOrMobile = () => isWidthDown(breakpoints.tablet, width!)
    const [drawerState, setDrawerState] = useState(!isTabletOrMobile())

    const matchesCurrentPath = (path: string): boolean => {
        const regexp = pathToRegexp(`${path}*`)
        console.log(`${path} matches ${location.pathname} ${regexp.test(location.pathname)}`)
        return regexp.test(location.pathname)
    }

    const goTo = (path: string) => {
        history.push(path)
    }

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
        anchor={isMobile() ? 'top' : 'left'}
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
        <div>
            <List>
                {MENU_ITEMS.map(({translationKey, svg, path}, index) => (
                    <ListItem className={classes.item} button key={index} onClick={() => goTo(path)}>
                        <ListItemIcon><img className={classes.icon} src={svg}/></ListItemIcon>
                        <ListItemText
                            classes={{
                                primary: `${classes.text} ${matchesCurrentPath(path) ? classes.textSelected : ''}`
                            }}
                            primary={t(translationKey)}/>
                    </ListItem>
                ))}
            </List>
        </div>
    </Drawer>
}

export default withWidth()(Menu)
