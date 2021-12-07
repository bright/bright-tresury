import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import bountySvg from '../../../../assets/menu_bounty_highlighted.svg'
import { ROUTE_BOUNTY } from '../../../../routes/routes'
import { NewBountyCommentData } from '../app-events.dto'
import NotificationsItemDescription from './components/NotificationsItemDescription'
import NotificationsItemTitle from './components/NotificationsItemTitle'
import NotificationsMenuItem from './components/NotificationsMenuItem'
import NotificationsMenuItemHeader from './components/NotificationsMenuItemHeader'
import { IdeaContentType } from '../../../../ideas/idea/Idea'

interface OwnProps {
    data: NewBountyCommentData
    closeMenu: () => void
}

export type BountyDiscussionProps = OwnProps

const BountyDiscussion = ({ data, closeMenu }: BountyDiscussionProps) => {
    const { t } = useTranslation()

    return (
        <NotificationsMenuItem
            closeMenu={closeMenu}
            redirectTo={`${generatePath(ROUTE_BOUNTY, { bountyIndex: data.bountyBlockchainId })}/${
                IdeaContentType.Discussion
            }`}
            networkId={data.networkId}
        >
            <NotificationsMenuItemHeader
                iconSvg={bountySvg}
                title={t('topBar.notifications.menuItems.bountyDiscussion.title')}
                goTo={t('topBar.notifications.menuItems.bountyDiscussion.goTo')}
            />
            <NotificationsItemTitle ordinalNumber={data.bountyBlockchainId} title={data.bountyTitle} />
            <NotificationsItemDescription
                description={t('topBar.notifications.menuItems.bountyDiscussion.description')}
            />
        </NotificationsMenuItem>
    )
}

export default BountyDiscussion
