import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useAuth } from '../../auth/AuthContext'
import { breakpoints } from '../../theme/theme'
import AccountInfo from './account/AccountInfo'
import NetworkPicker from './network/NetworkPicker'
import SignInButton from './SignInButton'

export const TABLET_TOP_BAR_HEIGHT = '77px'
export const DESKTOP_TOP_BAR_HEIGHT = '68px'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'fixed',
            top: '0',
            overflow: 'hidden',
            width: '100%',
            height: DESKTOP_TOP_BAR_HEIGHT,
            padding: '0 36px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                height: TABLET_TOP_BAR_HEIGHT,
                padding: '0 20px',
            },
            backgroundColor: theme.palette.network.main,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
        },
    }),
)

const TopBar = () => {
    const classes = useStyles()
    const { isUserSignedIn } = useAuth()

    return (
        <div className={classes.root}>
            <NetworkPicker />
            {isUserSignedIn ? <AccountInfo /> : <SignInButton />}
        </div>
    )
}

export default TopBar
