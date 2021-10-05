import React from 'react'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'
import { useTranslation } from 'react-i18next'
import infoIcon from '../../assets/info.svg'
import milestonesIcon from '../../assets/milestones.svg'
import discussionIcon from '../../assets/discussion.svg'
import votingIcon from '../../assets/voting.svg'
import { useRouteMatch } from 'react-router-dom'

export enum ProposalContentType {
    Info = 'info',
    Milestones = 'milestones',
    Discussion = 'discussion',
    Voting = 'voting',
}

interface OwnProps {
    discussionNotificationsCount?: number
}

export type ProposalContentTypeTabsProps = OwnProps

export const ProposalContentTypeTabs = ({ discussionNotificationsCount = 0 }: ProposalContentTypeTabsProps) => {
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

    const getNotificationsCount = (contentType: ProposalContentType): number => {
        switch (contentType) {
            case ProposalContentType.Info:
                return 0
            case ProposalContentType.Milestones:
                return 0
            case ProposalContentType.Discussion:
                return discussionNotificationsCount
            case ProposalContentType.Voting:
                return 0
        }
    }

    const tabEntries: TabEntry[] = Object.values(ProposalContentType).map((contentType: ProposalContentType) => {
        return {
            label: getTranslation(contentType),
            path: `${url}/${contentType}`,
            svg: getIcon(contentType),
            filterName: '',
            notificationsCount: getNotificationsCount(contentType),
        }
    })

    return (
        <div>
            <Tabs values={tabEntries} />
        </div>
    )
}
