import React from 'react'
import SignAndSubmitForm, { SignAndSubmitFormProps } from './SignAndSubmitForm'
import TransactionModal from './TransactionModal'

export interface OwnProps {
    title: string
    instruction: string | JSX.Element
}

export type SignAndSubmitProps = OwnProps & SignAndSubmitFormProps

const SignAndSubmit = ({ title, instruction, ...props }: SignAndSubmitProps) => {
    return (
        <TransactionModal title={title} instruction={instruction}>
            <SignAndSubmitForm {...props} />
        </TransactionModal>
    )
}

export default SignAndSubmit
