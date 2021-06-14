import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import React, { PropsWithChildren } from 'react'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginLeft: '2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '1em',
            },
        },
    }),
)
interface OwnProps {}
export type StatusProps = PropsWithChildren<OwnProps>
const Status = ({ children }: StatusProps) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}
export default Status
