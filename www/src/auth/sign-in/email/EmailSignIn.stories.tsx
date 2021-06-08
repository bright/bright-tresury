// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import EmailSignIn from './EmailSignIn'

export default {
    title: 'EmailSignIn',
    component: EmailSignIn,
} as Meta

const Template: Story = (args) => <EmailSignIn {...args} />

export const Default = Template.bind({})
Default.args = {}
