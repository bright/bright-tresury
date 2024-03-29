import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import proposalSvg from '../../../../assets/menu_proposals_highlighted.svg'
import { ROUTE_PROPOSAL } from '../../../../routes/routes'
import { AppEventType, NewProposalCommentData } from '../app-events.dto'
import NotificationsItemDescription from './components/NotificationsItemDescription'
import NotificationsItemTitle from './components/NotificationsItemTitle'
import NotificationsMenuItem from './components/NotificationsMenuItem'
import NotificationsMenuItemHeader from './components/NotificationsMenuItemHeader'
import { IdeaContentType } from '../../../../ideas/idea/Idea'

interface OwnProps {
    data: NewProposalCommentData
    closeMenu: () => void
}

export type ProposalDiscussionProps = OwnProps

const ProposalDiscussion = ({ data, closeMenu }: ProposalDiscussionProps) => {
    const { t } = useTranslation()

    return (
        <NotificationsMenuItem
            closeMenu={closeMenu}
            redirectTo={`${generatePath(ROUTE_PROPOSAL, { proposalIndex: data.proposalBlockchainId })}/${
                IdeaContentType.Discussion
            }`}
            networkId={data.networkId}
        >
            <NotificationsMenuItemHeader
                iconSvg={proposalSvg}
                title={t('topBar.notifications.menuItems.proposalDiscussion.title')}
                goTo={t('topBar.notifications.menuItems.proposalDiscussion.goTo')}
            />
            <NotificationsItemTitle ordinalNumber={data.proposalBlockchainId} title={data.proposalTitle} />
            <NotificationsItemDescription
                description={t(
                    data.type === AppEventType.NewProposalComment
                        ? 'topBar.notifications.menuItems.proposalDiscussion.description'
                        : 'topBar.notifications.menuItems.proposalDiscussion.tagged',
                )}
            />
        </NotificationsMenuItem>
    )
}

export default ProposalDiscussion
