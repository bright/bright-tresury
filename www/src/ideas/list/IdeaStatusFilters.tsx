import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles, Hidden} from "@material-ui/core";
import React from "react";
import {Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {ROUTE_IDEAS} from "../../routes/routes";
import {NavSelect} from "../../components/select/NavSelect";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        filterSelect: {
            fontWeight: 600,
            display: 'initial',
            [theme.breakpoints.up(breakpoints.tablet)]: {
                display: 'none',
            },
        },
    }),
);

export enum IdeaFilter {
    All = 'all',
    Mine = 'mine',
    Draft = 'draft',
    Active = 'active',
    TurnedIntoProposal = 'turnedIntoProposal',
    Closed = 'closed',
}

export const IdeaFilterSearchParamName = "filter"
export const IdeaDefaultFilter = IdeaFilter.All

interface Props {
    filter: IdeaFilter
}

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

    const getFilterOption = (filter: IdeaFilter) => {
        return {
            isDefault: filter === IdeaDefaultFilter,
            label: getTranslation(filter),
            path: `${ROUTE_IDEAS}?${IdeaFilterSearchParamName}=${filter}`
        }
    }
    const filterOptions = filterValues.map((filter: IdeaFilter) => getFilterOption(filter))

    /**
     * Current tab entry is forced, because there should be always some filter specified.
     */
    const currentFilterOption = filterOptions.find(entry =>
        entry.label === getTranslation(filter)
    )!

    return <div>
        <Hidden only={breakpoints.mobile}>
            <Tabs values={filterOptions}/>
        </Hidden>
        <NavSelect
            className={classes.filterSelect}
            value={currentFilterOption}
            options={filterOptions}
        />
    </div>
}

export default IdeaStatusFilters
