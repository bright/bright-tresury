import React, {useState} from "react";
import {TabEntry, Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import {IdeaFilter} from "../list/IdeaStatusFilters";

interface Props {
    onChange: (type: IdeaContentType) => void
}

export enum IdeaContentType {
    Info= "info",
    Milestones = "milestones",
    Discussion = "discussion"
}

const IdeaContentTypeTabs: React.FC<Props> = ({onChange}) => {
    const [filter, setFilter] = useState<IdeaContentType>(IdeaContentType.Info)
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

    const filterValues = Object.values(IdeaContentType)

    const tabEntries = filterValues.map((filter: IdeaContentType) => {
            return {
                value: filter,
                label: getTranslation(filter)
            } as TabEntry
        }
    )

    const onFilterChange = (filter: IdeaContentType) => {
        onChange(filter)
        setFilter(filter)
    }

    return <div>
        <Tabs
            value={filter}
            values={tabEntries}
            handleChange={(value: string) => onFilterChange(value as IdeaContentType)}
        />
    </div>
}

export default IdeaContentTypeTabs
