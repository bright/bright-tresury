import React from "react";
import {Select} from "../components/select/Select";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {proposalsHorizontalMargin, proposalsMobileHorizontalMargin} from "./Proposals";
import ProposalStatusFilters from "./list/ProposalStatusFilters";

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        header: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingTop: '32px',
        },
        newProposalButton: {
            margin: `0 ${proposalsHorizontalMargin}`,
            order: 1,
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginBottom: '8px'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                margin: `0px ${proposalsMobileHorizontalMargin} 16px ${proposalsMobileHorizontalMargin}`,
                flex: 1
            },
        },
        flexBreakLine: {
            order: 3,
            [theme.breakpoints.up(breakpoints.mobile)]: {
                flexBasis: '100%',
                height: 0,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            }
        },
        timeSelectWrapper: {
            order: 5,
            borderRadius: '8px',
            margin: `32px ${proposalsHorizontalMargin}`,
            backgroundColor: theme.palette.primary.light,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '32px'
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                margin: `0 ${proposalsHorizontalMargin}`
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
                borderRadius: '0',
                margin: `0`,
                background: theme.palette.background.paper,
                paddingTop: '8px',
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
            order: 4,
            overflowX: 'auto',
            position: 'relative',
            maxWidth: '50% !important',
            margin: `${proposalsHorizontalMargin}`,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 3,
                margin: `12px ${proposalsHorizontalMargin}`,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 5,
                margin: 0,
                background: theme.palette.background.paper,
                paddingTop: '8px',
                paddingRight: proposalsMobileHorizontalMargin
            }
        },
    })
})

interface Props {

}

const ProposalsHeader: React.FC<Props> = () => {
    const classes = useStyles()
    const {t} = useTranslation()
    const history = useHistory()

    return <div className={classes.header}>
        <div className={classes.flexBreakLine}/>
        <div className={classes.timeSelectWrapper}>
            <Select
                className={classes.timeSelect}
                value={t('proposal.list.filters.currentSpendTime')}
                options={[t('proposal.list.filters.currentSpendTime')]}
            />
        </div>
        <div className={classes.paperBackground}/>
        <div className={classes.statusFilters}>
            <ProposalStatusFilters/>
        </div>
    </div>
}

export default ProposalsHeader
