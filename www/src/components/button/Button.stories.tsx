// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import {Button, ButtonProps} from './Button';

export default {
    title: 'Button',
    component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} >Button</Button>;

export const Default = Template.bind({});
Default.args = {
    color: 'primary',
};

export const Text = Template.bind({});
Text.args = {
    color: 'primary',
    variant: 'text',
};

export const Outlined = Template.bind({});
Outlined.args = {
    color: 'primary',
    variant: 'outlined',
};

export const ContainedSecondary = Template.bind({});
ContainedSecondary.args = {
    color: 'secondary',
    variant: 'contained',
};
