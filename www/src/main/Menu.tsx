import {isWidthDown, withWidth} from '@material-ui/core';
import React, {useMemo} from 'react';

import {breakpoints} from "../theme/theme";
import {WithWidthProps} from "@material-ui/core/withWidth/withWidth";
import MenuDrawer from "./MenuDrawer";
import MenuMobileDrawer from "./MenuMobileDrawer";

const Menu: React.FC<WithWidthProps> = ({width}) => {
    const isMobile = useMemo(
        () => isWidthDown(breakpoints.mobile, width!),
        [width]
    )

    return isMobile ? <MenuMobileDrawer/> : <MenuDrawer/>
}

export default withWidth()(Menu)
