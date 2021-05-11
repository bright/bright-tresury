// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import Web3SignUp from './Web3SignUp';
import {MemoryRouter} from "react-router-dom";

export default {
    title: 'Web3SignUp',
    component: Web3SignUp,
} as Meta;

const Template: Story = () => <MemoryRouter>
    <Web3SignUp/>
</MemoryRouter>;

export const Default = Template.bind({});
Default.args = {};
