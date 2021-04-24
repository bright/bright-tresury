// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import BlockchainSignUp from './BlockchainSignUp';
import {MemoryRouter} from "react-router-dom";

export default {
    title: 'BlockchainSignUp',
    component: BlockchainSignUp,
} as Meta;

const Template: Story = (args) => <MemoryRouter>
    <BlockchainSignUp {...args} />
</MemoryRouter>;

export const Default = Template.bind({});
Default.args = {};
