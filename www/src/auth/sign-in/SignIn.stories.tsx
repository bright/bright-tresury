// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import SignIn from './SignIn';

export default {
    title: 'SignIn',
    component: SignIn,
} as Meta;

const Template: Story = (args) => <SignIn {...args} />;

export const Default = Template.bind({});
Default.args = {};
