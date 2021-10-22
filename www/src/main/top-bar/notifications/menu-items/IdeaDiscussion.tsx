import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import ideasSvg from '../../../../assets/menu_ideas_highlighted.svg'
import { useNetworks } from '../../../../networks/useNetworks'
import { ROUTE_IDEA } from '../../../../routes/routes'
import { NewIdeaCommentData } from '../app-events.dto'
import NotificationsItemDescription from './components/NotificationsItemDescription'
import NotificationsItemTitle from './components/NotificationsItemTitle'
import NotificationsMenuItem from './components/NotificationsMenuItem'
import NotificationsMenuItemHeader from './components/NotificationsMenuItemHeader'
import { IdeaContentType } from '../../../../ideas/idea/Idea'

interface OwnProps {
    data: NewIdeaCommentData
    closeMenu: () => void
}

export type IdeaDiscussionProps = OwnProps

const IdeaDiscussion = ({ data, closeMenu }: IdeaDiscussionProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()

    const networkId = data.networkIds.includes(network.id) ? network.id : data.networkIds[0]
    return (
        <NotificationsMenuItem
            closeMenu={closeMenu}
            redirectTo={`${generatePath(ROUTE_IDEA, { ideaId: data.ideaId })}/${IdeaContentType.Discussion}`}
            networkId={networkId}
        >
            <NotificationsMenuItemHeader
                iconSvg={ideasSvg}
                title={t('topBar.notifications.menuItems.ideaDiscussion.title')}
                goTo={t('topBar.notifications.menuItems.ideaDiscussion.goTo')}
            />
            <NotificationsItemTitle ordinalNumber={data.ideaOrdinalNumber} title={data.ideaTitle} />
            <NotificationsItemDescription
                description={t('topBar.notifications.menuItems.ideaDiscussion.description')}
            />
        </NotificationsMenuItem>
    )
}

export default IdeaDiscussion
