import React from "react";
import {createStyles, List, ListItem, ListItemIcon, ListItemText, Theme} from "@material-ui/core";
import {MENU_ITEMS, MenuItem} from "./MenuItems";
import {makeStyles} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {useTranslation} from "react-i18next";


const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            item: {
                display: 'flex',
                padding: '20px 38px',
                [theme.breakpoints.down(breakpoints.tablet)]: {
                    padding: '28px 28px 28px 0',
                },
            },
            text: {
                fontWeight: 500
            },
            textSelected: {
                fontWeight: 'bold',
            },
            icon: {
                padding: 0,
                maxHeight: 28,
                width: 22,
                [theme.breakpoints.down(breakpoints.tablet)]: {
                    maxHeight: 56,
                    width: 56,
                    margin: 14,
                    padding: 16
                }
            },
            iconSelected: {
                [theme.breakpoints.down(breakpoints.tablet)]: {
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 5
                }
            },
        })
    }
)

interface Props {
    currentItem: MenuItem,
    onItemSelected: (item: MenuItem) => void
}

const MenuItemsList: React.FC<Props> = ({currentItem, onItemSelected}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const isCurrentItem = (menuItem: MenuItem) => menuItem === currentItem

    return <div>
        <List>
            {MENU_ITEMS.map((menuItem: MenuItem, index) => (
                <ListItem className={classes.item} button key={index} onClick={() => onItemSelected(menuItem)}>
                    <ListItemIcon>
                        <img className={`${classes.icon} ${isCurrentItem(menuItem) ? classes.iconSelected : ''}`}
                             src={menuItem.svg}/>
                    </ListItemIcon>
                    <ListItemText
                        classes={{
                            primary: `${classes.text} ${isCurrentItem(menuItem) ? classes.textSelected : ''}`
                        }}
                        primary={t(menuItem.translationKey)}/>
                </ListItem>
            ))}
        </List>
    </div>
}

export default MenuItemsList
