import { Divider } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import arrowSvg from '../../../assets/account_menu_arrow.svg'
import { useAuth } from '../../../auth/AuthContext'
import IconButton from '../../../components/button/IconButton'
import { ROUTE_ACCOUNT } from '../../../routes/routes'
import { useMenu } from '../useMenu'
import AccountImage from './AccountImage'
import EmailVerifyErrorMenuItem from './EmailVerifyErrorMenuItem'
import MenuItem from './MenuItem'
import SignOutMenuItem from './SignOutMenuItem'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
        },
    }),
)

const AccountInfo = () => {
    const { t } = useTranslation()
    const classes = useStyles()
    const history = useHistory()
    const { user } = useAuth()

    const { anchorEl, open, handleClose, handleOpen } = useMenu()

    const goToAccount = () => {
        history.push(ROUTE_ACCOUNT)
        handleClose()
    }

    return (
        <div className={classes.root}>
            <AccountImage />
            <IconButton onClick={handleOpen} alt={t('topBar.showAccountMenu')} svg={arrowSvg} />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                {user && !user.isEmailVerified ? (
                    <>
                        <EmailVerifyErrorMenuItem />
                        <Divider />
                    </>
                ) : null}
                <MenuItem onClick={goToAccount}>{t('topBar.account.account')}</MenuItem>
                <Divider />
                <SignOutMenuItem />
            </Menu>
        </div>
    )
}

export default AccountInfo
