// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import {AuthContext, AuthContextState, AuthContextUser} from "../AuthContext";
import Account from "./Account";

export default {
    title: 'Account',
    component: Account,
} as Meta;

const Template: Story<AuthContextState> = (args) => <AuthContext.Provider value={args}>
    <Account/>
</AuthContext.Provider>;

export const Default = Template.bind({});
Default.args = {
    signOut: () => {
        return new Promise((resolve) => {
        })
    },
    user: {
        id: 'b17049e9-0044-4ba5-a4e9-d008130a068a',
        username: 'chuck',
        email: 'chuck@example.com',
        isEmailVerified: true,
        isEmailPassword: true,
        isWeb3: true,
        web3Addresses: [
            {address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', isPrimary: true},
            {address: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY', isPrimary: false},
        ]
    } as AuthContextUser,
    isUserSignedIn: true,
    isUserVerified: false,
};

export const NoEmailPassword = Template.bind({});
NoEmailPassword.args = {
    ...(Default.args),
    user: {
        ...(Default.args.user),
        isEmailPassword: false,
    } as AuthContextUser
};

export const EmailNotVerified = Template.bind({});
EmailNotVerified.args = {
    ...(Default.args),
    user: {
        ...(Default.args.user),
        isEmailVerified: false,
    } as AuthContextUser
};


export const NoWeb3Account = Template.bind({});
NoWeb3Account.args = {
    ...(Default.args),
    user: {
        ...(Default.args.user),
        isWeb3: false,
    } as AuthContextUser
};
