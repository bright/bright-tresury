import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../components/form/Container'
import EmailSignUp from './email/EmailSignUp'
import Web3SignUp from './web3/Web3SignUp'
import { SignToggle } from '../sign-components/SignToggle'
import { SignOption } from '../sign-components/SignOption'
import { SignSwitch } from '../sign-components/SignSwitch'

const SignUp: React.FC = () => {
    const { t } = useTranslation()

    const getTranslation = (option: SignOption): string => {
        switch (option) {
            case SignOption.Email:
                return t('auth.signUp.emailSignUpLabel')
            case SignOption.Web3:
                return t('auth.signUp.web3SignUpLabel')
        }
    }

    return (
        <Container title={t('auth.signUp.title')}>
            <SignToggle getTranslation={getTranslation} />
            <SignSwitch emailComponent={EmailSignUp} web3Component={Web3SignUp} />
        </Container>
    )
}

export default SignUp
