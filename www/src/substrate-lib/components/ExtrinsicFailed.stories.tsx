import React from 'react';
import {Story, Meta} from '@storybook/react/types-6-0';
import ExtrinsicFailed, {Props} from "./ExtrinsicFailed";

export default {
    title: 'Extrinsic Failed',
    component: ExtrinsicFailed,
} as Meta;

const Template: Story<Props> = (args) => <ExtrinsicFailed {...args}/>;

export const Default = Template.bind({});
Default.args = {
    error: {
        section: 'treasury',
        name: 'InsufficientProposersBalance',
        description: 'Desc'
    },
    onOk: () => {
        console.log('ok')
    },
};

export const DescriptionOnly = Template.bind({});
DescriptionOnly.args = {
    error: {
        description: 'This is just description'
    },
    onOk: () => {
        console.log('ok')
    },
};
