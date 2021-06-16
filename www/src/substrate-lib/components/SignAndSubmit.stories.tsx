import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import { Trans } from 'react-i18next'
import Strong from '../../components/strong/Strong'
import Modal from '../../components/modal/Modal'
import SignAndSubmit, { SignAndSubmitProps } from './SignAndSubmit'

export default {
    title: 'Sign And Submit',
    component: SignAndSubmit,
} as Meta

const Template: Story<SignAndSubmitProps> = (args) => (
    <Modal open={true}>
        <SignAndSubmit {...args} />
    </Modal>
)

export const Default = Template.bind({})
Default.args = {
    title: 'You are about to convert your idea into proposal',
    instruction: (
        <Trans
            id="modal-description"
            i18nKey="idea.details.submitProposalModal.warningMessage"
            components={{ strong: <Strong color={'primary'} /> }}
        />
    ),
    onSubmit: () => {
        console.log('submit')
    },
    onCancel: () => {
        console.log('cancel')
    },
    txAttrs: {
        palletRpc: '',
        callable: '',
        eventMethod: '',
    },
}
