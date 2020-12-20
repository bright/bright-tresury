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

export enum IdeaFilter {
    All = 'all',
    Active = 'active',
    Inactive = 'inactive',
    TurnedIntoProposal = 'turnedIntoProposal',
    Closed = 'closed',
}

const IdeaStatusFilters: React.FC<Props> = ({onChange}) => {
    const classes = useStyles()
    const [filter, setFilter] = useState<IdeaFilter>(IdeaFilter.All)
    const {t} = useTranslation()

    const getTranslation = (ideaFilter: IdeaFilter): string => {
        return t(`idea.list.filters.${ideaFilter}`)
    }

    const filterValues = Object.values(IdeaFilter)

    const valuesWithLabels = filterValues.map((filter: IdeaFilter) => {
            return {
                value: filter,
                label: getTranslation(filter)
            }
        }
    )

    const onFilterChange = (filter: IdeaFilter) => {
        onChange(filter)
        setFilter(filter)
    }

    return <div>
        <Tabs
            className={classes.filterTabs}
            value={filter}
            values={valuesWithLabels}
            handleChange={(value: string) => onFilterChange(value as IdeaFilter)}
        />
        <Select
            className={classes.filterSelect}
            value={filter}
            options={filterValues}
            disableFormik={true}
            renderOption={(option) => getTranslation(option)}
            onChange={(event: any) => {
                onFilterChange(event.target.value)
            }}
        />
    </div>
}

export default IdeaStatusFilters
