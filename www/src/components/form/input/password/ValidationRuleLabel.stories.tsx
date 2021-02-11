// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import React from 'react';
import {ValidationRuleLabel, ValidationRuleLabelProps} from "./ValidationRuleLabel";

export default {
    title: 'ValidationRuleLabel',
    component: ValidationRuleLabel,
} as Meta;

const Template: Story<ValidationRuleLabelProps> = (args) => <ValidationRuleLabel {...args} />;

export const NoError = Template.bind({});
NoError.args = {
    isError: false,
    message: 'Use 8 or more characters',
};

export const WithError = Template.bind({});
WithError.args = {
    isError: true,
    message: 'Use a number (e.g. 1234)',
};
