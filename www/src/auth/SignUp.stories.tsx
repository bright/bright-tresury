// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import SignUp from './SignUp';

export default {
    title: 'SignUp',
    component: SignUp,
} as Meta;

const Template: Story = (args) => <SignUp {...args} />;

export const Default = Template.bind({});
Default.args = {};
