import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { Modal } from '../../components/modal/Modal'
import TransactionInProgress, { Props } from './TransactionInProgress'

export default {
    title: 'Transaction In Progress',
    component: TransactionInProgress,
} as Meta

const Template: Story<Props> = (args) => (
    <Modal open={true}>
        <TransactionInProgress {...args} />
    </Modal>
)

export const InProgress = Template.bind({})
InProgress.args = {
    status: {
        isReady: true,
        isInBlock: true,
        isFinalized: false,
    },
    onOk: () => {
        console.log('ok')
    },
}

export const Finished = Template.bind({})
Finished.args = {
    status: {
        isReady: true,
        isInBlock: true,
        isFinalized: true,
    },
    onOk: () => {
        console.log('ok')
    },
}
