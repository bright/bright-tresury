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

const useStyles = makeStyles((theme: Theme) => {
        const drawerWidth = 250
        return createStyles({
            root: {
                [theme.breakpoints.up(breakpoints.mobile)]: {
                    width: drawerWidth,
                    flexShrink: 0,
                }
            },
            drawer: {
                width: drawerWidth
            },
            item: {
                padding: '20px 38px',
            },
            text: {
                fontWeight: 500
            },
            textSelected: {
                fontWeight: 'bold',
            },
            icon: {
                maxHeight: 28,
                [theme.breakpoints.down(breakpoints.tablet)]: {
                    maxHeight: 24,
                }
            }
        })
    }
)

const Menu: React.FC<WithWidthProps> = ({width}) => {
    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()
    const {t} = useTranslation()

    const isMobile = () => isWidthDown(breakpoints.mobile, width!)
    const [drawerState, setDrawerState] = useState(isMobile() ? false : true)

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

    return <div className={classes.root}>
        <Drawer
            container={container}
            onClose={() => setDrawerState(false)}
            anchor={isMobile() ? 'top' : 'left'}
            classes={{
                paper: classes.drawer
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
    </div>
}

export default withWidth()(Menu)
