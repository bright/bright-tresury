import React from "react";
import {generatePath} from "react-router-dom";
import {ROUTE_PROPOSAL} from "../../routes";
import {Divider} from "../../components/divider/Divider";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {ProposalDto} from "../proposals.api";
import {ProposalStatusIndicator} from "../status/ProposalStatusIndicator";
import {ProposalContentType} from "../proposal/ProposalContentTypeTabs";
import {ProposalIndex} from "./ProposalIndex";
import {NetworkCard} from "../../components/network/NetworkCard";
import {AddressInfo} from "../../components/identicon/AddressInfo";
import {NetworkValue} from "../../components/network/NetworkValue";
import {NetworkCardTitle} from "../../components/network/NetworkCardTitle";

const useStyles = makeStyles((theme: Theme) => createStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        marginBottom: '6px',
    },
    details: {
        padding: '0',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        [theme.breakpoints.down(breakpoints.mobile)]: {
            flexDirection: 'column-reverse',
            alignItems: 'flex-start'
        },
    },
    accountsWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
}))

interface Props {
    proposal: ProposalDto
}

const ProposalCard: React.FC<Props> = ({proposal}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const redirectTo = `${generatePath(
        ROUTE_PROPOSAL,
        {proposalIndex: proposal.proposalIndex})}` + `/${ProposalContentType.Info}`

    return <NetworkCard
        redirectTo={redirectTo}>

        <div className={classes.header}>
            <ProposalIndex proposalIndex={proposal.proposalIndex}/>
            <ProposalStatusIndicator proposalStatus={proposal.status}/>
        </div>

        <Divider/>

        <div className={classes.details}>
            <NetworkCardTitle title={proposal.title}/>
            <NetworkValue value={proposal.value}/>
        </div>

        <Divider/>

        <div className={classes.accountsWrapper}>
            <AddressInfo label={t('proposal.list.card.beneficiary')} address={proposal.beneficiary}/>
            <AddressInfo label={t('proposal.list.card.proposer')} address={proposal.proposer}/>
        </div>
    </NetworkCard>
}

export default ProposalCard
