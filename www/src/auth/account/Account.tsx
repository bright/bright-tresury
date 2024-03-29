import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../components/form/Container'
import { breakpoints } from '../../theme/theme'
import EmailPasswordAccount from './emailPassword/EmailPasswordAccount'
import Web3Account from './web3/Web3Account'
import AccountSettings from './AccountSettings'
import StyledSpacer from './StyledSpacer'
import Content from './Content'
import { useAuth, UserStatus } from '../AuthContext'
import DeleteAccount from './account-delete/DeleteAccount'
import { fromAuthContextUser } from '../../util/publicUser.dto'
import UserAvatar from '../../components/user/UserAvatar'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                flexDirection: 'column',
            },
            marginTop: '21px',
        },
        avatarContainer: {
            width: '46px',
            marginRight: '36px',
            marginTop: '44px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginRight: '0px',
                marginTop: '0px',
            },
        },
        wide: {
            width: '100%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
        avatar: {
            height: '46px',
            lineHeight: '46px',
            width: '46px',
        },
    }),
)

const Account = () => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { user } = useAuth()

    return (
        <Container title={t('account.title')}>
            <div className={classes.root}>
                <div className={classes.avatarContainer}>
                    {user ? <UserAvatar user={fromAuthContextUser(user)} size={46} className={classes.avatar} /> : null}
                </div>
                <Content>
                    <EmailPasswordAccount />
                    <StyledSpacer />
                    <div className={classes.wide}>
                        <Web3Account />
                    </div>
                    <StyledSpacer />
                    {user && user.status === UserStatus.EmailPasswordEnabled && user.isEmailVerified ? (
                        <>
                            <AccountSettings userId={user.id} />
                            <StyledSpacer />
                        </>
                    ) : null}
                    {user && <DeleteAccount user={user} />}
                </Content>
            </div>
        </Container>
    )
}
export default Account
