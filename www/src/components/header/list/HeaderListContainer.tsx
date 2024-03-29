import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { PropsWithChildren } from 'react'
import { breakpoints } from '../../../theme/theme'

export const headerListHorizontalMargin = '32px'
export const mobileHeaderListHorizontalMargin = '18px'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: theme.palette.background.default,
            padding: '32px 32px 24px 32px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '24px 2.2em 24px 2.2em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: 0,
                paddingRight: 0,
                paddingBottom: '8px',
                justifyContent: 'space-around',
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
    }),
)
export type HeaderListContainerProps = PropsWithChildren<{}>
const HeaderListContainer = ({ children }: HeaderListContainerProps) => {
    const classes = useStyles()
    return <div className={classes.root}>{children}</div>
}
export default HeaderListContainer
