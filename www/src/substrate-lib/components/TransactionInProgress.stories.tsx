import React from 'react';
import {Story, Meta} from '@storybook/react/types-6-0';
import TransactionInProgress, {Props} from "./TransactionInProgress";

export default {
    title: 'Transaction In Progress',
    component: TransactionInProgress,
} as Meta;

const Template: Story<Props> = (args) => <TransactionInProgress {...args}/>;

export const Default = Template.bind({});
Default.args = {
    status: {
        isReady: true,
        isInBlock: true,
        isFinalized: false
    },
    onOk: () => {
        console.log('ok')
    },
};
