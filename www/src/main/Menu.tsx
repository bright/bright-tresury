import {isWidthDown, withWidth} from '@material-ui/core';
import React from 'react';

import {breakpoints} from "../theme/theme";
import {WithWidthProps} from "@material-ui/core/withWidth/withWidth";
import MenuDrawer from "./MenuDrawer";
import MenuMobileDrawer from "./MenuMobileDrawer";


const Menu: React.FC<WithWidthProps> = ({width}) => {
    const isMobile = () => isWidthDown(breakpoints.mobile, width!)

    if(isMobile()) {
        return <MenuMobileDrawer />
    } else {
        return <MenuDrawer />
    }
}

export default withWidth()(Menu)
