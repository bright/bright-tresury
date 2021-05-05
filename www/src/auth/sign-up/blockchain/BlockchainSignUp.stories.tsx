// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import BlockchainSignUp from './BlockchainSignUp';

export default {
    title: 'BlockchainSignUp',
    component: BlockchainSignUp,
} as Meta;

const Template: Story = (args) => <BlockchainSignUp {...args} />;

export const Default = Template.bind({});
Default.args = {};
