import React from "react";
import {TabEntry, Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import InfoIcon from "../../assets/idea_info.svg";
import MilestonesIcon from "../../assets/idea_milestones.svg";
import DiscussionIcon from "../../assets/idea_discussion.svg";
import {useRouteMatch} from "react-router-dom";

interface Props {
    onChange: (type: IdeaContentType) => void
    contentType: IdeaContentType
}

export enum IdeaContentType {
    Info= "info",
    Milestones = "milestones",
    Discussion = "discussion"
}

const IdeaContentTypeTabs: React.FC<Props> = ({onChange, contentType}) => {
    const {t} = useTranslation()

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
                return InfoIcon
            case IdeaContentType.Milestones:
                return MilestonesIcon
            case IdeaContentType.Discussion:
                return DiscussionIcon
        }
    }

    const contentTypes = Object.values(IdeaContentType)

    let { url } = useRouteMatch();

    const tabEntries = contentTypes.map((contentType: IdeaContentType) => {
            return {
                value: contentType,
                label: getTranslation(contentType),
                path: `${url}/${contentType}`,
                svg: getIcon(contentType)
            } as TabEntry
        }
    )

    const onContentChange = (contentType: IdeaContentType) => {
        onChange(contentType)
    }

    return <div>
        <Tabs
            value={contentType}
            values={tabEntries}
            handleChange={(value: string) => onContentChange(value as IdeaContentType)}
        />
    </div>
}

export default IdeaContentTypeTabs
