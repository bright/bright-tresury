import { isWidthDown, withWidth } from '@material-ui/core'
import { WithWidthProps } from '@material-ui/core/withWidth/withWidth'
import React, { useMemo } from 'react'
import { breakpoints } from '../../theme/theme'
import MenuDrawer from './MenuDrawer'
import MenuMobileDrawer from './MenuMobileDrawer'

const Menu: React.FC<WithWidthProps> = ({ width }) => {
    const isMobile = useMemo(() => isWidthDown(breakpoints.mobile, width!), [width])

    return isMobile ? <MenuMobileDrawer /> : <MenuDrawer />
}

export default withWidth()(Menu)
