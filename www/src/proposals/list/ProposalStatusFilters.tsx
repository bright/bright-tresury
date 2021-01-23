import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles, Hidden} from "@material-ui/core";
import React from "react";
import {TabEntry, Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {ROUTE_PROPOSALS} from "../../routes";
import {useSearchParams} from "../../router/useSearchParams";
import {NavSelect} from "../../components/select/NavSelect";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        filterSelect: {
            display: 'none',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontWeight: 600,
                display: 'inherit'
            },
        }
    }),
);

export enum ProposalFilter {
    All = 'all',
    Published = 'published',
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
}

const FilterSearchParamName = "filter"
const DefaultFilter = ProposalFilter.All

const ProposalStatusFilters: React.FC = () => {
    const classes = useStyles()
    const {t} = useTranslation()

    const getTranslation = (proposalFilter: ProposalFilter): string => {
        switch (proposalFilter) {
            case ProposalFilter.All:
                return t('proposal.list.filters.all')
            case ProposalFilter.Published:
                return t('proposal.list.filters.published')
            case ProposalFilter.Submitted:
                return t('proposal.list.filters.submitted')
            case ProposalFilter.Approved:
                return t('proposal.list.filters.approved')
            case ProposalFilter.Rejected:
                return t('proposal.list.filters.rejected')
            case ProposalFilter.Rewarded:
                return t('proposal.list.filters.rewarded')
        }
    }

    const filterValues = Object.values(ProposalFilter)

    const getTabEntry = (filter: ProposalFilter) => {
        return {
            isDefault: filter === DefaultFilter,
            label: getTranslation(filter),
            path: `${ROUTE_PROPOSALS}?${FilterSearchParamName}=${filter}`
        } as TabEntry
    }
    const tabEntries = filterValues.map((filter: ProposalFilter) => getTabEntry(filter))

    const filterParam = useSearchParams().get(FilterSearchParamName)
    const filter = filterParam ? filterParam as ProposalFilter : DefaultFilter
    /**
     * Current tab entry is forced, because there should be always some filter specified.
     */
    const currentTabEntry = tabEntries.find(entry => entry.label === getTranslation(filter))!

    return <div>
        <Hidden only={breakpoints.mobile}>
            <Tabs values={tabEntries}/>
        </Hidden>
        <NavSelect
            className={classes.filterSelect}
            value={currentTabEntry}
            options={tabEntries}
        />
    </div>
}

export default ProposalStatusFilters
