import React, {useState} from "react";
import {ButtonBase, Menu} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import MenuItemsList from "./MenuItemsList";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {MENU_ITEMS, MenuItem} from "./MenuItems";
import pathToRegexp from "path-to-regexp"
import {useLocation} from "react-router-dom"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuButton: {
            padding: '10px 22px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            background: theme.palette.secondary.main
        },
        menuButtonIcon: {
            width: 20,
            height: 28,
            marginRight: 22
        },
        menuButtonText: {
            fontSize: 17,
            fontWeight: 600
        },
        menuButtonArrow: {
            marginLeft: 'auto',
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '7px solid #1B1D1C'
        },
        menu: {
            width: '100%',
            maxWidth: '100%',
            left: '0 !important'
        }
    }),
);

const MenuMobileDrawer: React.FC<{}> = () => {
    const classes = useStyles()
    const {t} = useTranslation()
    const location = useLocation()

    const [open, setOpen] = useState(false)

    const matchesCurrentPath = (path: string): boolean => {
        const regexp = pathToRegexp(`${path}*`)
        return regexp.test(location.pathname)
    }

    const getCurrentMenuItem = (): MenuItem => MENU_ITEMS
        .find(item => matchesCurrentPath(item.path)) || MENU_ITEMS[0]

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleOpen = (event: any) => {
        setAnchorEl(event.currentTarget)
        setOpen(true)
    }

    const handleClose = () => setOpen(false)

    return <>
        <ButtonBase className={classes.menuButton} onClick={handleOpen}>
            <img className={classes.menuButtonIcon} src={getCurrentMenuItem().svg} />
            <div className={classes.menuButtonText}>{t(getCurrentMenuItem().translationKey)}</div>
            <div className={classes.menuButtonArrow}/>
        </ButtonBase>
        <Menu
            className={classes.menu}
            keepMounted
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            PopoverClasses={{
                paper: classes.menu
            }}
            onClose={handleClose}>
            <MenuItemsList onSelected={handleClose}/>
        </Menu>
    </>
}

export default MenuMobileDrawer
