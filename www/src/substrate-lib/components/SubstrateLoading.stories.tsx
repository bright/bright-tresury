import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import Modal from '../../components/modal/Modal'
import SubstrateLoading, { Props } from './SubstrateLoading'

export default {
    title: 'Substrate Loading',
    component: SubstrateLoading,
} as Meta

const Template: Story<Props> = (args) => (
    <Modal open={true}>
        <SubstrateLoading {...args} />
    </Modal>
)

export const Default = Template.bind({})
Default.args = {
    onOk: () => {
        console.log('ok')
    },
}
