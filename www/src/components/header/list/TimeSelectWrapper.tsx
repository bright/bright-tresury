import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import React, { PropsWithChildren } from 'react'
import { ClassNameProps } from '../../props/className.props'
import clsx from 'clsx'
import { headerListHorizontalMargin, mobileHeaderListHorizontalMargin } from './HeaderListContainer'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: '8px',
            alignSelf: 'center',
            height: '32px',
            fontWeight: 900,
            backgroundColor: theme.palette.primary.light,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                height: '46px',
                borderRadius: '0',
                margin: `0`,
                background: theme.palette.background.paper,
                paddingLeft: mobileHeaderListHorizontalMargin,
            },
        },
    }),
)

interface OwnProps {}

export type TimeSelectWrapperProps = ClassNameProps & PropsWithChildren<OwnProps>

const TimeSelectWrapper = ({ className, children }: TimeSelectWrapperProps) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>{children}</div>
}
export default TimeSelectWrapper
