import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'
import { breakpoints } from '../../../theme/theme'
import { ClassNameProps } from '../../props/className.props'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItem: 'center',
            flexGrow: 1,
            gap: '18px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'row',
                position: 'fixed',
                padding: 16,
                background: theme.palette.background.default,
                bottom: '-30px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-around',
                width: '100vw',
                zIndex: 1,
                marginBottom: '25px',
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                flexGrow: 'unset',
                marginRight: '5px',
            },
        },
    }),
)
interface OwnProps {}
export type ActionButtonsProps = PropsWithChildren<OwnProps> & ClassNameProps
const ActionButtons = ({ children, className }: ActionButtonsProps) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>{children}</div>
}
export default ActionButtons
