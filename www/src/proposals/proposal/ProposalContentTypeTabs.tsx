import React from 'react'
import { TabEntry, Tabs } from '../../components/tabs/Tabs'
import { useTranslation } from 'react-i18next'
import infoIcon from '../../assets/info.svg'
import milestonesIcon from '../../assets/milestones.svg'
import discussionIcon from '../../assets/discussion.svg'
import votingIcon from '../../assets/voting.svg'
import { useRouteMatch } from 'react-router-dom'
import { ProposalDto } from '../proposals.api'

export enum ProposalContentType {
    Info = 'info',
    Milestones = 'milestones',
    Discussion = 'discussion',
    Voting = 'voting',
}

interface Props {
    proposal: ProposalDto
}

export const ProposalContentTypeTabs = ({ proposal }: Props) => {
    const { t } = useTranslation()

    let { url } = useRouteMatch()

    const getTranslation = (contentType: ProposalContentType): string => {
        switch (contentType) {
            case ProposalContentType.Info:
                return t('proposal.content.infoLabel')
            case ProposalContentType.Milestones:
                return t('proposal.content.milestonesLabel')
            case ProposalContentType.Discussion:
                return t('proposal.content.discussionLabel')
            case ProposalContentType.Voting:
                return t('proposal.content.votingLabel')
        }
    }

    const getIcon = (contentType: ProposalContentType): string => {
        switch (contentType) {
            case ProposalContentType.Info:
                return infoIcon
            case ProposalContentType.Milestones:
                return milestonesIcon
            case ProposalContentType.Discussion:
                return discussionIcon
            case ProposalContentType.Voting:
                return votingIcon
        }
    }

    // Milestones content tab should be visible only if proposal was created from idea
    const contentTypes = Object.values(ProposalContentType).filter((contentType) => {
        if (contentType === ProposalContentType.Milestones) {
            return proposal.isCreatedFromIdea
        }
        return true
    })

    const tabEntries = contentTypes.map((contentType: ProposalContentType) => {
        return {
            label: getTranslation(contentType),
            path: `${url}/${contentType}`,
            svg: getIcon(contentType),
        } as TabEntry
    })

    return (
        <div>
            <Tabs values={tabEntries} />
        </div>
    )
}
