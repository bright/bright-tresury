import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { PropsWithChildren } from 'react'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: theme.palette.background.default,
            padding: '32px 32px 24px 32px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '24px 2.2em 24px 2.2em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
    }),
)

interface OwnProps {}
export type HeaderContainerProps = PropsWithChildren<OwnProps>
const HeaderContainer = ({ children }: HeaderContainerProps) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}
export default HeaderContainer
