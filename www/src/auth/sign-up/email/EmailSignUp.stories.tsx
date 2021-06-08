// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import EmailSignUp from './EmailSignUp'
import { MemoryRouter } from 'react-router'

export default {
    title: 'EmailSignUp',
    component: EmailSignUp,
} as Meta

const Template: Story = () => (
    <MemoryRouter>
        <EmailSignUp />
    </MemoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
