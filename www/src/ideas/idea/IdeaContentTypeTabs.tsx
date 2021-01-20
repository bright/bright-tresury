import React from "react";
import {TabEntry, Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import infoIcon from "../../assets/idea_info.svg";
import milestonesIcon from "../../assets/idea_milestones.svg";
import discussionIcon from "../../assets/idea_discussion.svg";
import {useRouteMatch} from "react-router-dom";

export enum IdeaContentType {
    Info = "info",
    Milestones = "milestones",
    Discussion = "discussion"
}

const IdeaContentTypeTabs: React.FC<{}> = () => {
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
                return infoIcon
            case IdeaContentType.Milestones:
                return milestonesIcon
            case IdeaContentType.Discussion:
                return discussionIcon
        }
    }

    const contentTypes = Object.values(IdeaContentType)

    let { url } = useRouteMatch();

    const tabEntries = contentTypes.map((contentType: IdeaContentType) => {
            return {
                label: getTranslation(contentType),
                path: `${url}/${contentType}`,
                svg: getIcon(contentType)
            } as TabEntry
        }
    )

    return <div>
        <Tabs values={tabEntries}/>
    </div>
}

export default IdeaContentTypeTabs
