import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import React from "react";
import {TabEntry, Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {ISelect, Select} from "../../components/select/Select";
import {NavLink} from "react-router-dom";
import {ROUTE_IDEAS} from "../../routes";

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
        },
        filterSelectLink: {
            textDecoration: 'none',
            width: '100%',
            color: theme.palette.text.primary
        }
    }),
);

const FilterSelect = Select as ISelect<TabEntry>

export enum IdeaFilter {
    All = 'all',
    Mine = 'mine',
    Draft = 'draft',
    Active = 'active',
    TurnedIntoProposal = 'turnedIntoProposal',
    Closed = 'closed',
}

interface Props {
    filter: IdeaFilter
}

export const FilterSearchParamName = "filter"
export const DefaultFilter = IdeaFilter.All

const IdeaStatusFilters: React.FC<Props> = ({filter}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const getTranslation = (ideaFilter: IdeaFilter): string => {
        switch (ideaFilter) {
            case IdeaFilter.All:
                return t('idea.list.filters.all')
            case IdeaFilter.Mine:
                return t('idea.list.filters.mine')
            case IdeaFilter.Draft:
                return t('idea.list.filters.draft')
            case IdeaFilter.Active:
                return t('idea.list.filters.active')
            case IdeaFilter.TurnedIntoProposal:
                return t('idea.list.filters.turnedIntoProposal')
            case IdeaFilter.Closed:
                return t('idea.list.filters.closed')
        }
    }

    const filterValues = Object.values(IdeaFilter)

    const getTabEntry = (filter: IdeaFilter) => {
        return {
            isDefault: filter === DefaultFilter,
            label: getTranslation(filter),
            path: `${ROUTE_IDEAS}?${FilterSearchParamName}=${filter}`
        } as TabEntry
    }
    const tabEntries = filterValues.map((filter: IdeaFilter) => getTabEntry(filter))

    /**
     * Current tab entry is forced, because there should be always some filter specified.
     */
    const currentTabEntry = tabEntries.find(entry =>
        entry.label === getTranslation(filter ? filter : IdeaFilter.All)
    )!

    return <div>
        <div className={classes.filterTabs}>
            <Tabs values={tabEntries}/>
        </div>
        <FilterSelect
            className={classes.filterSelect}
            value={currentTabEntry}
            options={tabEntries}
            renderOption={(option: TabEntry) =>
                <NavLink className={classes.filterSelectLink} to={option.path}>{option.label}</NavLink>
            }
        />
    </div>
}

export default IdeaStatusFilters
