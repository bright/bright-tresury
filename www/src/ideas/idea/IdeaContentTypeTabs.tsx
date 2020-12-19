import React, {useState} from "react";
import {Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";

interface Props {
    onChange: (type: IdeaContentType) => void
}

export enum IdeaContentType {
    Info,
    Milestones,
    Discussion
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
        .filter((value: any) => typeof value === 'number')

    const filterOptions = filterValues.map((filter: string | IdeaContentType) =>
        getTranslation(filter as IdeaContentType)
    )

    const onFilterChange = (filter: IdeaContentType) => {
        onChange(filter)
        setFilter(filter)
    }

    return <div>
        <Tabs
            value={getTranslation(filter)}
            values={filterOptions}
            handleChange={(index: number) => onFilterChange(filterValues[index] as IdeaContentType)}
        />
    </div>
}

export default IdeaContentTypeTabs
