import {isWidthDown, withWidth} from '@material-ui/core';
import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {MENU_ITEMS, MenuItem} from "./MenuItems";
import pathToRegexp from "path-to-regexp"
import {breakpoints} from "../theme/theme";
import {WithWidthProps} from "@material-ui/core/withWidth/withWidth";
import MenuDrawer from "./MenuDrawer";
import MenuMobileDrawer from "./MenuMobileDrawer";


const Menu: React.FC<WithWidthProps> = ({width}) => {
    const history = useHistory()
    const location = useLocation()
    const {t} = useTranslation()

    const isMobile = () => isWidthDown(breakpoints.mobile, width!)


    const matchesCurrentPath = (path: string): boolean => {
        const regexp = pathToRegexp(`${path}*`)
        return regexp.test(location.pathname)
    }

    const getCurrentMenuItem = (): MenuItem => MENU_ITEMS
        .find(item => matchesCurrentPath(item.path)) || MENU_ITEMS[0]

    const onItemSelected = (menuItem: MenuItem) => {
        history.push(menuItem.path)
    }


    if(isMobile()) {
        return <MenuMobileDrawer currentItem={getCurrentMenuItem()} onItemSelected={onItemSelected}/>
    } else {
        return <MenuDrawer currentItem={getCurrentMenuItem()} onItemSelected={onItemSelected}/>
    }
}

export default withWidth()(Menu)
