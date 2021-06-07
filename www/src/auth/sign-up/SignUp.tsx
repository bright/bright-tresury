import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../components/form/Container'
import SignToggle from "../sign-components/SignToggle";
import EmailSignUp from './email/EmailSignUp'
import Web3SignUp from './web3/Web3SignUp'
import { SignOption } from '../sign-components/SignOption'
import SignSwitch from '../sign-components/SignSwitch';

const SignUp = () => {
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
