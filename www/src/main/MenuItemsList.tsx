import React from "react";
import {createStyles, List, ListItem, Theme} from "@material-ui/core";
import {MENU_ITEMS, MenuItem} from "./MenuItems";
import {makeStyles} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            item: {
                padding: '20px 38px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                [theme.breakpoints.down(breakpoints.tablet)]: {
                    padding: '28px 28px 28px 0',
                },
                [theme.breakpoints.down(breakpoints.mobile)]: {
                    padding: '42px 24px 42px 24px',
                }
            },
            activeItem: {
                /**
                 * Selectors below are used to propagate active state of [NavLink] component to it's children.
                 */
                '& img': {
                    [theme.breakpoints.only(breakpoints.tablet)]: {
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 5
                    }
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
            link: {
                textDecoration: 'none',
                minHeight: 0,
                color: theme.palette.text.primary
            }
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
            <ListItem disableGutters={true} button onClick={() => {
                if (onSelected) {
                    onSelected()
                }
            }}>
                <NavLink className={`${classes.link} ${classes.item}`} to={menuItem.path}
                         activeClassName={classes.activeItem}
                         key={index}>
                    <img className={classes.icon} src={menuItem.svg}/>
                    <div className={classes.text}>{t(menuItem.translationKey)}</div>
                </NavLink>
            </ListItem>
        ))}
    </List>
}

export default MenuItemsList
