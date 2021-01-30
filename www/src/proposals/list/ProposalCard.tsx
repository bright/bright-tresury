import React from "react";
import {generatePath} from "react-router-dom";
import {ROUTE_PROPOSAL} from "../../routes";
import {Divider} from "../../components/divider/Divider";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {formatNumber} from "../../util/numberUtil";
import {ProposalDto} from "../proposals.api";
import {ProposalStatusIndicator} from "../status/ProposalStatusIndicator";
import {ProposalContentType} from "../proposal/ProposalContentTypeTabs";
import {ProposalIndex} from "./ProposalNumber";
import {Placeholder} from "../../components/text/Placeholder";
import {NetworkCard} from "../../components/card/NetworkCard";
import {AddressInfo} from "../../components/identicon/AddressInfo";

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
    titleLabel: {
        display: 'inline-block',
        fontSize: '18px',
        marginBottom: '16px',
        marginTop: 0,
        fontWeight: 700,
        width: '100%',
        maxHeight: '3em',
        textOverflow: `ellipsis`,
        overflow: `hidden`,
        [theme.breakpoints.up(breakpoints.tablet)]: {
            height: '3em',
            flex: 1,
            marginTop: '16px'
        },
    },
    titlePlaceholder: {
        fontSize: '18px',
        color: theme.palette.text.hint,
        fontWeight: 500
    },
    networkLabel: {
        backgroundColor: '#E6F0FD',
        borderRadius: '3px',
        fontSize: '1em',
        marginTop: '16px',
        display: 'block',
        position: 'relative',
        [theme.breakpoints.up(breakpoints.tablet)]: {
            marginLeft: '4em',
        },
        fontWeight: 500,
        padding: '3px'
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
        {proposalId: proposal.proposalIndex})}
        /${ProposalContentType.Info}`

    return <NetworkCard
        redirectTo={redirectTo}>
        <div className={classes.header}>
            <ProposalIndex proposalIndex={proposal.proposalIndex}/>
            <ProposalStatusIndicator proposalStatus={proposal.status}/>
        </div>

        <Divider/>

        <div className={classes.details}>
            <p className={classes.titleLabel}>
                {proposal.title ||
                <Placeholder className={classes.titlePlaceholder} value={t('proposal.list.card.titlePlaceholder')}/>
                }
            </p>
            <p className={classes.networkLabel}>{`${formatNumber(proposal.value)} LOC`}</p>
        </div>

        <Divider/>

        <div className={classes.accountsWrapper}>
            <AddressInfo label={t('proposal.list.card.beneficiary')} address={proposal.beneficiary}/>
            <AddressInfo label={t('proposal.list.card.proposer')} address={proposal.proposer}/>
        </div>
    </NetworkCard>
}

export default ProposalCard
