import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import SubstrateLoading, {Props} from "./SubstrateLoading";

export default {
    title: 'Substrate Loading',
    component: SubstrateLoading,
} as Meta;

const Template: Story<Props> = (args) => <SubstrateLoading {...args}/>;

export const Default = Template.bind({});
Default.args = {
    onOk: () => {
        console.log('ok')
    },
};
