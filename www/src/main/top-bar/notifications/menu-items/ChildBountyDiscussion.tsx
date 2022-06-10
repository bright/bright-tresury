import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import bountySvg from '../../../../assets/menu_bounty_highlighted.svg'
import { ROUTE_CHILD_BOUNTY } from '../../../../routes/routes'
import { AppEventType, NewChildBountyCommentData } from '../app-events.dto'
import NotificationsItemDescription from './components/NotificationsItemDescription'
import NotificationsItemTitle from './components/NotificationsItemTitle'
import NotificationsMenuItem from './components/NotificationsMenuItem'
import NotificationsMenuItemHeader from './components/NotificationsMenuItemHeader'
import { ChildBountyContentType } from '../../../../bounties/bounty/child-bounties/child-bounty/ChildBounty'
import { childBountyOrdinalNumber } from '../../../../util/childBountyOrdinalNumberUtil'

interface OwnProps {
    data: NewChildBountyCommentData
    closeMenu: () => void
}

export type ChildBountyDiscussionProps = OwnProps

const ChildBountyDiscussion = ({ data, closeMenu }: ChildBountyDiscussionProps) => {
    const { t } = useTranslation()
    const ordinalChildBountyNumber = childBountyOrdinalNumber({
        parentIndex: data.bountyBlockchainId,
        childBountyIndex: data.childBountyBlockchainId,
    })

    return (
        <NotificationsMenuItem
            closeMenu={closeMenu}
            redirectTo={`${generatePath(ROUTE_CHILD_BOUNTY, {
                bountyIndex: Number(data.bountyBlockchainId),
                childBountyIndex: Number(data.childBountyBlockchainId),
            })}/${ChildBountyContentType.Discussion}`}
            networkId={data.networkId}
        >
            <NotificationsMenuItemHeader
                iconSvg={bountySvg}
                title={t('topBar.notifications.menuItems.childBountyDiscussion.title')}
                goTo={t('topBar.notifications.menuItems.childBountyDiscussion.goTo')}
            />
            <NotificationsItemTitle ordinalNumber={ordinalChildBountyNumber} title={data.childBountyTitle} />
            <NotificationsItemDescription
                description={t(
                    data.type === AppEventType.NewChildBountyComment
                        ? 'topBar.notifications.menuItems.childBountyDiscussion.description'
                        : 'topBar.notifications.menuItems.childBountyDiscussion.tagged',
                )}
            />
        </NotificationsMenuItem>
    )
}

export default ChildBountyDiscussion
