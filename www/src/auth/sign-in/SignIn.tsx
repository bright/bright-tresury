import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import loginImg from '../../assets/login.svg'
import Container from '../../components/form/Container'
import { breakpoints } from '../../theme/theme'
import EmailSignIn from './email/EmailSignIn'
import { SignOption } from '../sign-components/SignOption'
import { SignToggle } from '../sign-components/SignToggle'
import { SignSwitch } from '../sign-components/SignSwitch'
import Web3SignIn from './web3/Web3SignIn'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            alignSelf: 'center',
            margin: '3em 0',
            flexGrow: 1,
            height: '163px',
            width: '273px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
            },
        },
    }),
)

const SignIn = () => {
    const { t } = useTranslation()
    const classes = useStyles()

    const getTranslation = (option: SignOption): string => {
        switch (option) {
            case SignOption.Email:
                return t('auth.signIn.emailSignInLabel')
            case SignOption.Web3:
                return t('auth.signIn.web3SignInLabel')
        }
    }

    return (
        <Container title={t('auth.signIn.title')}>
            <img className={classes.image} src={loginImg} alt={''} />
            <SignToggle getTranslation={getTranslation} />
            <SignSwitch emailComponent={EmailSignIn} web3Component={Web3SignIn} />
        </Container>
    )
}

export default SignIn
