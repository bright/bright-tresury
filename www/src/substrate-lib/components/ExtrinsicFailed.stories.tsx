import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Modal from '../../components/modal/Modal'
import ExtrinsicFailed, { ExtrinsicFailedProps } from './ExtrinsicFailed'

export default {
    title: 'Extrinsic Failed',
    component: ExtrinsicFailed,
} as Meta

const Template: Story<ExtrinsicFailedProps> = (args) => (
    <Modal open={true}>
        <ExtrinsicFailed {...args} />
    </Modal>
)

export const Default = Template.bind({})
Default.args = {
    error: {
        section: 'treasury',
        name: 'InsufficientProposersBalance',
        description: 'Desc',
    },
    onOk: () => {
        console.log('ok')
    },
}

export const DescriptionOnly = Template.bind({})
DescriptionOnly.args = {
    error: {
        description: 'This is just description',
    },
    onOk: () => {
        console.log('ok')
    },
}
