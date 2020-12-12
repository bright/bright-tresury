import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import React, {useState} from "react";
import {Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        filters: {
            margin: '16px 32px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                margin: '8px 32px'
            }
        }
    }),
);

interface Props {
    onChange: (filter: IdeaFilter) => void
}

const IdeaFilters: React.FC<Props> = ({onChange}) => {
    const classes = useStyles()
    const [filter, setFilter] = useState<IdeaFilter>(IdeaFilter.All)
    const {t} = useTranslation()

    const getTranslation = (ideaFilter: IdeaFilter): string => {
        switch (ideaFilter) {
            case IdeaFilter.All:
                return t('idea.list.filters.all')
            case IdeaFilter.Active:
                return t('idea.list.filters.active')
            case IdeaFilter.Inactive:
                return t('idea.list.filters.inactive')
            case IdeaFilter.TurnedIntoProposal:
                return t('idea.list.filters.turnedIntoProposal')
            case IdeaFilter.Closed:
                return t('idea.list.filters.closed')
        }
    }

    const filterValues = Object.values(IdeaFilter)
        .filter((value: any) => typeof value === 'number')

    const tabs = filterValues.map((filter: string | IdeaFilter) => getTranslation(filter as IdeaFilter))

    const onFilterChange = (filter: IdeaFilter) => {
        onChange(filter)
        setFilter(filter)
    }

    return <div>
        <Tabs
            className={classes.filters}
            value={getTranslation(filter)}
            values={tabs}
            handleChange={(index: number) => onFilterChange(filterValues[index] as IdeaFilter)}
        />
    </div>
}

export enum IdeaFilter {
    All,
    Active,
    Inactive,
    TurnedIntoProposal,
    Closed,
}

export default IdeaFilters
