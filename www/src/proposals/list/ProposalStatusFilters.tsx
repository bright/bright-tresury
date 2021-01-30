import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles, Hidden} from "@material-ui/core";
import React from "react";
import {TabEntry, Tabs} from "../../components/tabs/Tabs";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {ROUTE_PROPOSALS} from "../../routes";
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
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
}

export const ProposalFilterSearchParamName = "filter"
export const ProposalDefaultFilter = ProposalFilter.All

interface Props {
    filter: ProposalFilter
}

const ProposalStatusFilters: React.FC<Props> = ({filter}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const getTranslation = (proposalFilter: ProposalFilter): string => {
        switch (proposalFilter) {
            case ProposalFilter.All:
                return t('proposal.list.filters.all')
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

    const getFilterOption = (filter: ProposalFilter) => {
        return {
            isDefault: filter === ProposalDefaultFilter,
            label: getTranslation(filter),
            path: `${ROUTE_PROPOSALS}?${ProposalFilterSearchParamName}=${filter}`
        } as TabEntry
    }
    const filterOptions = filterValues.map((filter: ProposalFilter) => getFilterOption(filter))

    /**
     * Current tab entry is forced, because there should be always some filter specified.
     */
    const currentFilterOption = filterOptions.find(entry => entry.label === getTranslation(filter))!

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

export default ProposalStatusFilters
