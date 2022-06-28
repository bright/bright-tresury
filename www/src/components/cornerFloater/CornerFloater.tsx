import { PropsWithChildren, useMemo } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'fixed',
            zIndex: 5000,
            bottom: '2px',
            right: '6px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                bottom: '6px',
                right: '6px',
            },
        },
    }),
)

interface OwnProps {}
export type CornerFloaterProps = PropsWithChildren<OwnProps>
const CornerFloater = ({ children }: CornerFloaterProps) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}
export default CornerFloater
