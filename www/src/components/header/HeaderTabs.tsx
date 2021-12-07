import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import React, { PropsWithChildren } from 'react'
import { ClassNameProps } from '../props/className.props'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            overflow: 'auto',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingBottom: 0,
            },
        },
    }),
)
interface OwnProps {}
export type HeaderTabsProps = ClassNameProps & PropsWithChildren<OwnProps>
const HeaderTabs = ({ className, children }: HeaderTabsProps) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>{children}</div>
}
export default HeaderTabs
