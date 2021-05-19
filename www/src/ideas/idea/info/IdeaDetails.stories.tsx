import { ButtonProps as MaterialButtonProps } from '@material-ui/core/Button/Button'
import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import IdeaDetails, { IdeaDetailsProps } from './IdeaDetails'
import { createEmptyIdea } from '../../ideas.dto'

export default {
    title: 'IdeaDetails',
    component: IdeaDetails,
} as Meta

const Template: Story<IdeaDetailsProps> = (args) => <IdeaDetails {...args} />

const emptyIdea = createEmptyIdea('localhost')
export const Default = Template.bind({})
Default.args = {
    idea: { ...emptyIdea, links: ['http://bright.dev'] },
}
