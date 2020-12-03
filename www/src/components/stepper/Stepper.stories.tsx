import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { Stepper, Props as StepperProps } from './Stepper';

export default {
  title: 'Stepper',
  component: Stepper,
} as Meta;

const Template: Story<StepperProps> = (args) => <Stepper {...args}/>;

export const Default = Template.bind({});
Default.args = {
  steps: ['transaction ready', 'transaction inblock', 'event propose spend finished', 'transaction finalised'],
  activeStep: 2
};
