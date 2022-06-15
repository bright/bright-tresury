import { Theme, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import userDeletedSuccess from '../../../assets/user-deleted-success.svg'
import HeaderContainer from '../../../components/header/details/HeaderContainer'
import { Header } from '../../../components/text/Header'
import { ROUTE_ROOT } from '../../../routes/routes'
import { breakpoints } from '../../../theme/theme'
import { useAuth } from '../../AuthContext'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        subtitle: {
            textAlign: 'center',
            marginTop: '30px',
            fontSize: '14px',
        },
        root: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            height: '100%',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                marginTop: '4em',
                width: '100%',
                height: '100%',
            },
        },
        image: {
            marginTop: '70px',
            marginBottom: '100px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
                marginBottom: '30vh',
            },
        },
    }),
)

const AccountDeleted = () => {
    const history = useHistory()
    const classes = useStyles()
    const { t } = useTranslation()

    const { refreshSession } = useAuth()

    useEffect(() => {
        refreshSession()
    }, [refreshSession])

    const goToRoot = () => {
        history.push(ROUTE_ROOT)
    }

    return (
        <HeaderContainer onClose={goToRoot}>
            <div className={classes.root}>
                <Header>{t('auth.deleteAccount.success.title')}</Header>
                <Typography className={classes.subtitle}>{t('auth.deleteAccount.success.information')}</Typography>
                <img className={classes.image} src={userDeletedSuccess} alt={t('auth.deleteAccount.success.image')} />
            </div>
        </HeaderContainer>
    )
}

export default AccountDeleted
