import {Meta, Story} from '@storybook/react/types-6-0';
import i18next from "i18next";
import React from 'react';
import {Trans} from "react-i18next";
import TransactionError, {Props} from "./TransactionError";

export default {
    title: 'Transaction Error',
    component: TransactionError,
} as Meta;

const Template: Story<Props> = (args) => <TransactionError {...args}/>;

export const Default = Template.bind({});
Default.args = {
    error: {},
    onOk: () => {
        console.log('ok')
    },
    title: 'Error title',
    subtitle: 'Error longer description'
};

export const WithKnownError = Template.bind({});
WithKnownError.args = {
    error: {
        message: '1010: Known error message'
    },
    onOk: () => {
        console.log('ok')
    },
    title: 'Error title'
};

export const WithUnknownError = Template.bind({});
WithUnknownError.args = {
    error: {
        message: '1020: Unknown error message'
    },
    onOk: () => {
        console.log('ok')
    },
    title: 'Error title'
};

export const WithNoErrorObject = Template.bind({});
WithNoErrorObject.args = {
    onOk: () => {
        console.log('ok')
    },
    title: 'Error title'
};

export const NoAccounts = Template.bind({});
NoAccounts.args = {
    onOk: () => {
        console.log('ok')
    },
    title: i18next.t('substrate.error.accounts.title'),
    subtitle: <Trans id='modal-description'
                     i18nKey="substrate.error.accounts.subtitle"
                     components={{a: <a href='https://google.pl'/>}}
    />
};
