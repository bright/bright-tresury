import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import ProposalContentTypeTabs from "./ProposalContentTypeTabs";
import {breakpoints} from "../../theme/theme";
import {ProposalIndex} from "../list/ProposalIndex";
import {ProposalStatusIndicator} from "../status/ProposalStatusIndicator";
import {ProposalDto} from "../proposals.api";
import {NetworkRewardDeposit} from "../../components/network/NetworkRewardDeposit";
import {CloseIcon} from "../../components/closeIcon/CloseIcon";
import {ROUTE_PROPOSALS} from "../../routes";
import {useHistory} from "react-router-dom";
import {OptionalTitle} from "../../components/text/OptionalTitle";
import {HeaderContainer} from "../../components/header/details/HeaderContainer";
import {BasicInfo} from "../../components/header/BasicInfo";
import {NetworkValues} from "../../components/header/details/NetworkValues";
import {FlexBreakLine} from "../../components/header/FlexBreakLine";
import {HeaderTabs} from "../../components/header/HeaderTabs";
import {BasicInfoDivider} from "../../components/header/details/BasicInfoDivider";
import {Title} from "../../components/header/details/Title";
import {Status} from "../../components/header/details/Status";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        flexBreakLine: {
            order: 3
        },
        networkValues: {
            order: 2,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            }
        },
        contentTypeTabs: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 5,
            },
        },
    }),
);

interface Props {
    proposal: ProposalDto
}

const ProposalHeader: React.FC<Props> = ({proposal}) => {
    const classes = useStyles()
    const history = useHistory()

    const navigateToList = () => {
        history.push(ROUTE_PROPOSALS)
    }

    return <HeaderContainer>
        <CloseIcon onClose={navigateToList}/>

        <BasicInfo>
            <ProposalIndex proposalIndex={proposal.proposalIndex}/>
            <BasicInfoDivider/>
            <Status>
                <ProposalStatusIndicator proposalStatus={proposal.status}/>
            </Status>
            <Title>
                <OptionalTitle title={proposal.title}/>
            </Title>
        </BasicInfo>

        <NetworkValues className={classes.networkValues}>
            <NetworkRewardDeposit rewardValue={proposal.value} bondValue={proposal.bond}/>
        </NetworkValues>

        <FlexBreakLine className={classes.flexBreakLine}/>

        <HeaderTabs className={classes.contentTypeTabs}>
            <ProposalContentTypeTabs/>
        </HeaderTabs>

    </HeaderContainer>
}

export default ProposalHeader
