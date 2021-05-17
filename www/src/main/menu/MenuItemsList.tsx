import {createStyles, List, ListItem, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {breakpoints} from "../../theme/theme";
import {MENU_ITEMS, MenuItem} from "./MenuItems";

const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            navLinkItem: {
                padding: '20px 38px',
                display: 'flex',
                alignItems: 'center',
                alignContent: 'center',
                width: '100%',
                textDecoration: 'none',
                minHeight: 0,
                color: theme.palette.text.primary,
                [theme.breakpoints.down(breakpoints.tablet)]: {
                    padding: '28px 28px 28px 0',
                },
                [theme.breakpoints.down(breakpoints.mobile)]: {
                    padding: '42px 24px 42px 24px',
                },
                /**
                 * Selector below are used to propagate inactive state of [NavLink] component to it's children.
                 */
                '& .iconActive': {
                    display: 'none'
                },
                '& .iconInactive': {
                    display: 'initial'
                },
            },
            activeItem: {
                /**
                 * Selector below are used to propagate active state of [NavLink] component to it's children.
                 */
                '& img': {
                    [theme.breakpoints.only(breakpoints.tablet)]: {
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 5
                    }
                },
                '& .iconActive': {
                    display: 'initial'
                },
                '& .iconInactive': {
                    display: 'none'
                },
                '& div': {
                    fontWeight: 'bold',
                },
            },
            text: {
                fontSize: 18,
                fontWeight: 500,
                fontFamily: theme.typography.fontFamily,
                [theme.breakpoints.down(breakpoints.tablet)]: {
                    fontSize: 21
                },
            },
            icon: {
                padding: 0,
                maxHeight: 28,
                width: 22,
                marginRight: 14,
                [theme.breakpoints.only(breakpoints.tablet)]: {
                    maxHeight: 60,
                    width: 60,
                    minWidth: 60,
                    margin: 12,
                    padding: 16,
                },
                [theme.breakpoints.down(breakpoints.mobile)]: {
                    maxHeight: 30,
                    width: 26,
                },
            },
        })
    }
)

interface Props {
    onSelected?: () => void
}

const MenuItemsList: React.FC<Props> = ({onSelected}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <List disablePadding={true} dense={true}>
        {MENU_ITEMS.map((menuItem: MenuItem, index) => (
            <ListItem key={index} disableGutters={true} button onClick={() => {
                if (onSelected) {
                    onSelected()
                }
            }}>
                <NavLink className={classes.navLinkItem} to={menuItem.path}
                         activeClassName={classes.activeItem}
                         key={index}>
                    <img className={`${classes.icon} iconInactive`} src={menuItem.svg} alt={t(menuItem.translationKey)}/>
                    <img className={`${classes.icon} iconActive`} src={menuItem.svgHighlighted} alt={t(menuItem.translationKey)}/>
                    <div className={classes.text}>{t(menuItem.translationKey)}</div>
                </NavLink>
            </ListItem>
        ))}
    </List>
}

export default MenuItemsList
