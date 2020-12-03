import React from 'react';
import {Story, Meta} from '@storybook/react/types-6-0';
import TransactionWarning, {Props} from "./TransactionWarning";

export default {
    title: 'Warning',
    component: TransactionWarning,
} as Meta;

const Template: Story<Props> = (args) => <TransactionWarning {...args}/>;

export const Default = Template.bind({});
Default.args = {
    error: {},
    onOk: () => {
        console.log('ok')
    },
};