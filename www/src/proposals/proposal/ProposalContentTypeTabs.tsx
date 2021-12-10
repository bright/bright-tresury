import React from 'react'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'
import { useTranslation } from 'react-i18next'
import { useRouteMatch } from 'react-router-dom'
import { ProposalTabConfig } from './Proposal'

export enum ProposalContentType {
    Info = 'info',
    Milestones = 'milestones',
    Discussion = 'discussion',
    Voting = 'voting',
}

interface OwnProps {
    proposalTabsConfig: ProposalTabConfig[]
}

export type ProposalContentTypeTabsProps = OwnProps

export const ProposalContentTypeTabs = ({ proposalTabsConfig }: ProposalContentTypeTabsProps) => {
    const { t } = useTranslation()

    let { url } = useRouteMatch()

    const tabEntries: TabEntry[] = proposalTabsConfig.map((proposalTabConfig) => {
        return {
            label: t(proposalTabConfig.translationKey),
            path: proposalTabConfig.getUrl(url),
            svg: proposalTabConfig.svg,
            filterName: proposalTabConfig.proposalContentType,
            notificationsCount: proposalTabConfig.notificationsCount ?? 0,
            isDefault: proposalTabConfig.isDefault,
        }
    })

    return (
        <div>
            <Tabs values={tabEntries} />
        </div>
    )
}
