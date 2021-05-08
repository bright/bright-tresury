// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import Web3SignIn from "./Web3SignIn";

export default {
    title: 'Web3SignIn',
    component: Web3SignIn,
} as Meta;

const Template: Story = (args) => <Web3SignIn {...args} />;

export const Default = Template.bind({});
Default.args = {};
