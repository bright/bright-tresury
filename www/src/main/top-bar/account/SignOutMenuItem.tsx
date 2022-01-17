import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import lockSrc from '../../../assets/lock.svg'
import { useAuth } from '../../../auth/AuthContext'
import MenuItem from './MenuItem'

const useStyles = makeStyles(() =>
    createStyles({
        image: {
            marginRight: '14px',
        },
    }),
)

const SignOutMenuItem = () => {
    const { t } = useTranslation()
    const classes = useStyles()

    const { signOut } = useAuth()

    return (
        <MenuItem onClick={signOut}>
            <img className={classes.image} src={lockSrc} alt={t('topBar.account.signOut')} />
            {t('topBar.account.signOut')}
        </MenuItem>
    )
}

export default SignOutMenuItem
