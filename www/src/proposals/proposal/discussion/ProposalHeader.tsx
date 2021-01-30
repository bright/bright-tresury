import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import ProposalContentTypeTabs from "../ProposalContentTypeTabs";
import {breakpoints} from "../../../theme/theme";
import {ProposalIndex} from "../../list/ProposalNumber";
import {ProposalStatusIndicator} from "../../status/ProposalStatusIndicator";
import {ProposalDto} from "../../proposals.api";
import {Divider} from "../../../components/divider/Divider";
import {NetworkRewardDeposit} from "../../../components/network/NetworkRewardDeposit";
import {CloseIcon} from "../../../components/closeIcon/CloseIcon";
import {ROUTE_PROPOSALS} from "../../../routes";
import {useHistory} from "react-router-dom";
import {OptionalTitle} from "../../../components/text/OptionalTitle";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerContainer: {
            background: theme.palette.background.default,
            padding: '2em 7em 2em 3em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '1em 2.2em 1em 2.2em'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: 0,
                paddingRight: 0
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        basicInfo: {
            order: 1,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1.5em',
            },
        },
        basicInfoDivider: {
            height: '20px',
            marginLeft: '2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '1em'
            }
        },
        status: {
            marginLeft: '2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '1em'
            },
        },
        title: {
            marginRight: '.5em',
            fontSize: 18,
            flexBasis: '100%'
        },
        flexBreakLine: {
            flexBasis: '100%',
            height: 0,
            order: 3
        },
        networkValues: {
            alignSelf: 'flex-start',
            order: 2,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
                justifyContent: 'center',
                width: '100%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
                paddingLeft: '1.5em',
                paddingRight: '1.5em'
            }
        },
        contentTypeTabs: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginTop: '20px',
                order: 5,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                overflowX: 'auto',
                paddingLeft: '1.5em'
            }
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

    return <div className={classes.headerContainer}>
        <CloseIcon onClose={navigateToList}/>

        <div className={classes.basicInfo}>
            <ProposalIndex proposalIndex={proposal.proposalIndex}/>
            <Divider className={classes.basicInfoDivider} orientation="vertical"/>
            <div className={classes.status}>
                <ProposalStatusIndicator proposalStatus={proposal.status}/>
            </div>
            <div className={classes.title}>
                <OptionalTitle title={proposal.title}/>
            </div>
        </div>

        <div className={classes.networkValues}>
            <NetworkRewardDeposit rewardValue={proposal.value} bondValue={proposal.bond}/>
        </div>

        <div className={classes.flexBreakLine}/>

        <div className={classes.contentTypeTabs}>
            <ProposalContentTypeTabs/>
        </div>

    </div>
}

export default ProposalHeader
