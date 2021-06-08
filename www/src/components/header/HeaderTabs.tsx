import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import React from 'react'
import { ClassNameProps } from '../props/className.props'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            overflowX: 'auto',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingBottom: 0,
            },
        },
    }),
)

export const HeaderTabs: React.FC<ClassNameProps> = ({ className, children }) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>{children}</div>
}
