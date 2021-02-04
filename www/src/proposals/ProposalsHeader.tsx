import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../theme/theme";
import {Trans} from "react-i18next";
import ProposalStatusFilters, {ProposalFilter} from "./list/ProposalStatusFilters";
import {ROUTE_NEW_IDEA} from "../routes";
import {RouterLink} from "../components/link/RouterLink";
import {TimeSelect} from "../components/select/TimeSelect";
import {BasicInfo} from "../components/header/BasicInfo";
import {FlexBreakLine} from "../components/header/FlexBreakLine";
import {HeaderListContainer} from "../components/headerList/HeaderListContainer";
import {HeaderListTabs} from "../components/headerList/HeaderListTabs";
import {PaperFilterBackground} from "../components/headerList/PaperFilterBackground";
import {TimeSelectWrapper} from "../components/headerList/TimeSelectWrapper";

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        flexBreakLine: {
            order: 2,
            [theme.breakpoints.only(breakpoints.tablet)]: {
                order: 3,
            },
        },
        timeSelectWrapper: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            },
        },
        paperBackground: {
            order: 4,
        },
        statusFilters: {
            order: 3,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 3,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 5,
            }
        },
    })
})

interface Props {
    filter: ProposalFilter
}

const ProposalsHeader: React.FC<Props> = ({filter}) => {
    const classes = useStyles()
    return <HeaderListContainer>
        <BasicInfo>
            <Trans id='modal-description'
                   i18nKey="proposal.list.introduceIdea"
                   components={{a: <RouterLink to={ROUTE_NEW_IDEA}/>}}
            />
        </BasicInfo>
        <FlexBreakLine className={classes.flexBreakLine}/>
        <TimeSelectWrapper className={classes.timeSelectWrapper}>
            <TimeSelect/>
        </TimeSelectWrapper>
        <PaperFilterBackground className={classes.paperBackground}/>
        <HeaderListTabs className={classes.statusFilters}>
            <ProposalStatusFilters filter={filter}/>
        </HeaderListTabs>
    </HeaderListContainer>
}

export default ProposalsHeader
