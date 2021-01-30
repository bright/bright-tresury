import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {Trans, useTranslation} from "react-i18next";
import {proposalsHorizontalMargin, proposalsMobileHorizontalMargin} from "./Proposals";
import ProposalStatusFilters, {ProposalFilter} from "./list/ProposalStatusFilters";
import {ideasHorizontalMargin, ideasMobileHorizontalMargin} from "../ideas/Ideas";
import {ROUTE_NEW_IDEA} from "../routes";
import {RouterLink} from "../components/link/RouterLink";
import {TimeSelect} from "../components/select/TimeSelect";

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        header: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingTop: '32px',
        },
        introduceIdea: {
            margin: `0 ${ideasHorizontalMargin}`,
            order: 1,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginBottom: '8px'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '16px',
                margin: `0px ${ideasMobileHorizontalMargin} 32px ${ideasMobileHorizontalMargin}`,
                flex: 1,
                textAlign: 'center'
            },
        },
        flexBreakLine: {
            order: 2,
            flexBasis: '100%',
            height: 0,
            [theme.breakpoints.only(breakpoints.tablet)]: {
                order: 3,
            },
        },
        timeSelectWrapper: {
            order: 4,
            borderRadius: '8px',
            alignSelf: 'center',
            margin: `32px ${proposalsHorizontalMargin}`,
            backgroundColor: theme.palette.primary.light,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '32px',
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                marginBottom: 8,
                margin: `0 ${proposalsHorizontalMargin}`
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
                borderRadius: '0',
                margin: `0`,
                background: theme.palette.background.paper,
                paddingLeft: proposalsMobileHorizontalMargin
            },
        },
        timeSelect: {
            fontWeight: 600,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '32px',
            },
        },
        paperBackground: {
            display: 'none',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                display: 'initial',
                flexGrow: 1,
                order: 4,
                backgroundColor: theme.palette.background.paper
            }
        },
        statusFilters: {
            order: 3,
            overflowX: 'auto',
            position: 'relative',
            margin: `${proposalsHorizontalMargin}`,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                flex: 1,
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                maxWidth: '100%',
                order: 3,
                margin: `16px ${proposalsHorizontalMargin}`,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 5,
                margin: 0,
                background: theme.palette.background.paper,
                paddingRight: proposalsMobileHorizontalMargin
            }
        },
    })
})

interface Props {
    filter: ProposalFilter
}

const ProposalsHeader: React.FC<Props> = ({filter}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <div className={classes.header}>
        <div className={classes.introduceIdea}>
            <Trans id='modal-description'
                   i18nKey="proposal.list.introduceIdea"
                   components={{a: <RouterLink to={ROUTE_NEW_IDEA}/>}}
            />
        </div>
        <div className={classes.flexBreakLine}/>
        <div className={classes.timeSelectWrapper}>
            <TimeSelect/>
        </div>
        <div className={classes.paperBackground}/>
        <div className={classes.statusFilters}>
            <ProposalStatusFilters filter={filter}/>
        </div>
    </div>
}

export default ProposalsHeader
