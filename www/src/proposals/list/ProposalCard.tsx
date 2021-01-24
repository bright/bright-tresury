import React from "react";
import {Card} from "../../components/card/Card";
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

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            transform: 'scale(1.01)'
        },
        transition: 'transform 0.2s',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
    },
    networkAccentLine: {
        backgroundColor: '#E6007A',
        height: '100%',
        width: '4px',
        position: 'absolute'
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    },
    contentMargin: {
        margin: '0 20px 0 24px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    idLabel: {
        marginTop: '20px',
        marginBottom: '6px',
        fontSize: '16px',
        fontWeight: 700
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
        fontSize: '1.5em',
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

    return <Card className={classes.root}>
        {/*TODO: create common network aware card that will switch left ribbon and replace it in [IdeaCard.tsx]*/}
        <div className={classes.networkAccentLine}/>
        <Link className={classes.link}
              to={`${generatePath(ROUTE_PROPOSAL, {proposalId: proposal.proposalIndex})}/${ProposalContentType.Info}`}>
            <div className={`${classes.header} ${classes.contentMargin}`}>
                <p className={classes.idLabel}>{proposal.proposalIndex}</p>
                <ProposalStatusIndicator proposalStatus={proposal.status}/>
            </div>

            <Divider className={classes.contentMargin}/>

            <div className={`${classes.contentMargin} ${classes.details}`}>
                <p className={classes.titleLabel}>{proposal.title}</p>
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
    </Card>
}

export default ProposalCard
