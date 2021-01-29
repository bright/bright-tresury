import React from "react";
import {generatePath, Link} from "react-router-dom";
import {ROUTE_PROPOSAL} from "../../routes";
import {Divider} from "../../components/divider/Divider";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {ellipseTextInTheMiddle} from "../../util/stringUtil";
import {formatNumber} from "../../util/numberUtil";
import {Identicon} from "../../components/identicon/Identicon";
import {ProposalDto} from "../proposals.api";
import {ProposalStatusIndicator} from "../status/ProposalStatusIndicator";
import {ProposalContentType} from "../proposal/ProposalContentTypeTabs";
import {ProposalIndex} from "./ProposalNumber";
import {Placeholder} from "../../components/text/Placeholder";
import {NetworkCard} from "../../components/card/NetworkCard";

const useStyles = makeStyles((theme: Theme) => createStyles({
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    },
    contentMargin: {
        margin: '0 20px 0 24px'
    },
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
        color: theme.palette.text.hint
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
    accountWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    accountInfo: {
        display: 'flex',
        marginLeft: '.75em',
        flexDirection: 'row',
    },
    accountValue: {
        fontSize: '1em',
        height: '1em',
        fontWeight: 600,
        marginTop: '24px',
        marginBottom: '4px'
    },
    accountLabel: {
        fontSize: '12px',
        fontWeight: 700,
        marginBottom: '24px',
        marginTop: '0',
        color: theme.palette.text.disabled
    }
}))

interface Props {
    proposal: ProposalDto
}

const ProposalCard: React.FC<Props> = ({proposal}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const getBeneficiaryFragment = (): string => {
        if (!proposal.beneficiary) return ''
        return ellipseTextInTheMiddle(proposal.beneficiary, 12)
    }

    const getProposerFragment = (): string => {
        if (!proposal.proposer) return ''
        return ellipseTextInTheMiddle(proposal.proposer, 12)
    }

    return <NetworkCard>
        <Link className={classes.link}
              to={`${generatePath(ROUTE_PROPOSAL, {proposalId: proposal.proposalIndex})}/${ProposalContentType.Info}`}>
            <div className={`${classes.header} ${classes.contentMargin}`}>
                <ProposalIndex proposalIndex={proposal.proposalIndex}/>
                <ProposalStatusIndicator proposalStatus={proposal.status}/>
            </div>

            <Divider className={classes.contentMargin}/>

            <div className={`${classes.contentMargin} ${classes.details}`}>
                <p className={classes.titleLabel}>
                    {proposal.title ||
                    <Placeholder className={classes.titlePlaceholder} value={t('proposal.list.card.titlePlaceholder')}/>
                    }
                </p>
                <p className={classes.networkLabel}>{`${formatNumber(proposal.value)} LOC`}</p>
            </div>

            <Divider className={classes.contentMargin}/>

            <div className={`${classes.contentMargin} ${classes.accountsWrapper}`}>
                <div className={classes.accountWrapper}>
                    <Identicon account={proposal.beneficiary}/>
                    <div className={classes.accountInfo}>
                        <div>
                            <p className={classes.accountValue}>
                                {getBeneficiaryFragment()}
                            </p>
                            <p className={classes.accountLabel}>{t('proposal.list.card.beneficiary')}</p>
                        </div>
                    </div>
                </div>

                {/*TODO: create common view for such account details and replace it here and in [IdeaCard.tsx]*/}
                <div className={classes.accountWrapper}>
                    <Identicon account={proposal.proposer}/>
                    <div className={classes.accountInfo}>
                        <div>
                            <p className={classes.accountValue}>
                                {getProposerFragment()}
                            </p>
                            <p className={classes.accountLabel}>{t('proposal.list.card.proposer')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </NetworkCard>
}

export default ProposalCard
