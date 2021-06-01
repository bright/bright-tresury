import React from 'react'
import {SignOption} from '../../sign-components/SignOption'
import {AlreadySignedUp} from '../common/AlreadySignedUp'
import EmailSignUpForm from './form/EmailSignUpForm'

const EmailSignUp = () => {
    return (
        <>
            <EmailSignUpForm/>
            <AlreadySignedUp signOption={SignOption.Email} />
        </>
    )
}

export default EmailSignUp
