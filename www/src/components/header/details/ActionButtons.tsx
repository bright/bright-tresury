import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'
import { breakpoints } from '../../../theme/theme'
import { ClassNameProps } from '../../props/className.props'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        turnIntoProposal: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '5px',
            flexGrow: 1,
            gap: '18px',
            [theme.breakpoints.up(breakpoints.mobile)]: {
                alignSelf: 'flex-end',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column-reverse',
                position: 'fixed',
                padding: 16,
                background: theme.palette.background.default,
                bottom: '-30px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                width: '100vw',
                zIndex: 1,
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                flexGrow: 'unset',
                marginBottom: '25px',
                marginRight: '5px',
            },
        },
    }),
)
interface OwnProps {}
export type ActionButtonsProps = PropsWithChildren<OwnProps> & ClassNameProps
const ActionButtons = ({ children, className }: ActionButtonsProps) => {
    const classes = useStyles()
    return <div className={clsx(classes.turnIntoProposal, className)}>{children}</div>
}
export default ActionButtons
