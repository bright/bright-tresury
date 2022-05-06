import React from 'react'
import { AppEventType, NewTipCommentData } from '../app-events.dto'
import { useTranslation } from 'react-i18next'
import NotificationsMenuItem from './components/NotificationsMenuItem'
import { generatePath } from 'react-router'
import { ROUTE_TIP } from '../../../../routes/routes'
import { TipContentType } from '../../../../tips/tip/Tip'
import NotificationsMenuItemHeader from './components/NotificationsMenuItemHeader'
import tipSvg from '../../../../assets/menu_tips_highlighted.svg'
import NotificationsItemTitle from './components/NotificationsItemTitle'
import NotificationsItemDescription from './components/NotificationsItemDescription'

interface OwnProps {
    data: NewTipCommentData
    closeMenu: () => void
}

export type TipDiscussionProps = OwnProps

const TipDiscussion = ({ data, closeMenu }: TipDiscussionProps) => {
    const { t } = useTranslation()

    return (
        <NotificationsMenuItem
            closeMenu={closeMenu}
            redirectTo={`${generatePath(ROUTE_TIP, { tipHash: data.tipHash })}/${TipContentType.Discussion}`}
            networkId={data.networkId}
        >
            <NotificationsMenuItemHeader
                iconSvg={tipSvg}
                title={t('topBar.notifications.menuItems.tipDiscussion.title')}
                goTo={t('topBar.notifications.menuItems.tipDiscussion.goTo')}
            />
            <NotificationsItemTitle ordinalNumber={Number(data.tipHash)} title={data.tipTitle} />
            <NotificationsItemDescription
                description={t(
                    data.type === AppEventType.NewTipComment
                        ? 'topBar.notifications.menuItems.tipDiscussion.description'
                        : 'topBar.notifications.menuItems.tipDiscussion.tagged',
                )}
            />
        </NotificationsMenuItem>
    )
}

export default TipDiscussion
