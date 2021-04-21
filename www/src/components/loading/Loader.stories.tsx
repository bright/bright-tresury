// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import { Loader } from './Loader';

export default {
    title: 'Loader',
    component: Loader,
} as Meta;

const Template: Story = () => <Loader/>;

export const Default = Template.bind({});
Default.args = {
};
