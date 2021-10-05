import React from 'react'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'
import { useTranslation } from 'react-i18next'
import infoIcon from '../../assets/info.svg'
import milestonesIcon from '../../assets/milestones.svg'
import discussionIcon from '../../assets/discussion.svg'
import { useRouteMatch } from 'react-router-dom'

export enum IdeaContentType {
    Info = 'info',
    Milestones = 'milestones',
    Discussion = 'discussion',
}

interface OwnProps {
    discussionNotificationsCount?: number
}

export type IdeaContentTypeTabsProps = OwnProps

const IdeaContentTypeTabs = ({ discussionNotificationsCount = 0 }: IdeaContentTypeTabsProps) => {
    const { t } = useTranslation()

    const getTranslation = (ideaContentType: IdeaContentType): string => {
        switch (ideaContentType) {
            case IdeaContentType.Info:
                return t('idea.content.infoLabel')
            case IdeaContentType.Milestones:
                return t('idea.content.milestonesLabel')
            case IdeaContentType.Discussion:
                return t('idea.content.discussionLabel')
        }
    }

    const getIcon = (ideaContentType: IdeaContentType): string => {
        switch (ideaContentType) {
            case IdeaContentType.Info:
                return infoIcon
            case IdeaContentType.Milestones:
                return milestonesIcon
            case IdeaContentType.Discussion:
                return discussionIcon
        }
    }

    const getNotificationsCount = (ideaContentType: IdeaContentType): number => {
        switch (ideaContentType) {
            case IdeaContentType.Info:
                return 0
            case IdeaContentType.Milestones:
                return 0
            case IdeaContentType.Discussion:
                return discussionNotificationsCount
        }
    }

    const contentTypes = Object.values(IdeaContentType)

    let { url } = useRouteMatch()

    const tabEntries: TabEntry[] = contentTypes.map((contentType: IdeaContentType) => {
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

export default IdeaContentTypeTabs
