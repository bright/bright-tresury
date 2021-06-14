import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import React, { PropsWithChildren } from 'react'
import { ClassNameProps } from '../../props/className.props'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            alignSelf: 'flex-start',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                justifyContent: 'center',
                width: '100%',
                marginBottom: '16px',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                marginTop: 0,
            },
        },
    }),
)
interface OwnProps {}
export type NetworkValuesProps = ClassNameProps & PropsWithChildren<OwnProps>
const NetworkValues = ({ className, children }: NetworkValuesProps) => {
    const classes = useStyles()
    return <div className={clsx(classes.root, className)}>{children}</div>
}
export default NetworkValues
