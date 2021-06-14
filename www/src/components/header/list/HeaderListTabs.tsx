import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import React, { PropsWithChildren } from 'react'
import clsx from 'clsx'
import HeaderTabs from '../HeaderTabs'
import { ClassNameProps } from '../../props/className.props'
import { mobileHeaderListHorizontalMargin } from './HeaderListContainer'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                height: '46px',
                margin: 0,
                background: theme.palette.background.paper,
                paddingRight: mobileHeaderListHorizontalMargin,
            },
        },
    }),
)
export type HeaderListTabsProps = ClassNameProps & PropsWithChildren<{}>
const HeaderListTabs = ({ className, children }: HeaderListTabsProps) => {
    const classes = useStyles()
    return <HeaderTabs className={clsx(classes.root, className)}>{children}</HeaderTabs>
}
export default HeaderListTabs
