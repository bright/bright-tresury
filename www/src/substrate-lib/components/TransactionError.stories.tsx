import React from 'react';
import {Story, Meta} from '@storybook/react/types-6-0';
import TransactionError, {Props} from "./TransactionError";

export default {
    title: 'Error',
    component: TransactionError,
} as Meta;

const Template: Story<Props> = (args) => <TransactionError {...args}/>;

export const Default = Template.bind({});
Default.args = {
    error: {},
    onOk: () => {
        console.log('ok')
    },
};