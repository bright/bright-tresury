import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import React, {useState} from "react";
import {Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {Select} from "../../components/select/Select";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        filterTabs: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                display: 'none'
            },
        },
        filterSelect: {
            display: 'none',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontWeight: 600,
                display: 'inherit'
            },
        }
    }),
);

interface Props {
    onChange: (filter: IdeaFilter) => void
}

const IdeaStatusFilters: React.FC<Props> = ({onChange}) => {
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

    const filterOptions = filterValues.map((filter: string | IdeaFilter) =>
        getTranslation(filter as IdeaFilter)
    )

    const onFilterChange = (filter: IdeaFilter) => {
        onChange(filter)
        setFilter(filter)
    }

    return <div>
        <Tabs
            className={classes.filterTabs}
            value={getTranslation(filter)}
            values={filterOptions}
            handleChange={(index: number) => onFilterChange(filterValues[index] as IdeaFilter)}
        />
        <Select
            className={classes.filterSelect}
            value={getTranslation(filter)}
            options={filterOptions}
            disableFormik={true}
            onChange={(event: any) => {
                onFilterChange(filterValues[filterOptions.indexOf(event.target.value)] as IdeaFilter)
            }}
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

export default IdeaStatusFilters
