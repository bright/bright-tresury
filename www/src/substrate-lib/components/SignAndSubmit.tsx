import React from 'react'
import SignAndSubmitForm, { Props as SignAndSubmitFormProps } from './SignAndSubmitForm'
import TransactionModal from './TransactionModal'

export interface OwnProps {
    title: string
    instruction: string | JSX.Element
}

export type Props = OwnProps & SignAndSubmitFormProps

const SignAndSubmit: React.FC<Props> = ({ title, instruction, ...props }) => {
    return (
        <TransactionModal title={title} instruction={instruction}>
            <SignAndSubmitForm {...props} />
        </TransactionModal>
    )
}

export default SignAndSubmit
