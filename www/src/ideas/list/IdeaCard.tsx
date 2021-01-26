import React from "react";
import {IdeaDto} from "../ideas.api";
import {Card} from "../../components/card/Card";
import {generatePath, Link} from "react-router-dom";
import {ROUTE_IDEA} from "../../routes";
import {Divider} from "../../components/divider/Divider";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {ellipseTextInTheMiddle} from "../../util/stringUtil";
import {formatNumber} from "../../util/numberUtil";
import {Identicon} from "../../components/identicon/Identicon";
import {IdeaContentType} from "../idea/IdeaContentTypeTabs";
import {IdeaStatusIndicator} from "../idea/status/IdeaStatusIndicator";
import {IdeaOrdinalNumber} from "./IdeaOrdinalNumber";

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
        marginTop: '20px',
        marginBottom: '6px',
        display: 'flex',
        justifyContent: 'space-between'
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
    beneficiaryWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    beneficiaryInfo: {
        display: 'flex',
        marginLeft: '.75em',
        flexDirection: 'row',
    },
    beneficiaryValue: {
        fontSize: '1em',
        height: '1em',
        fontWeight: 600,
        marginTop: '24px',
        marginBottom: '4px'
    },
    beneficiaryLabel: {
        fontSize: '12px',
        fontWeight: 700,
        marginBottom: '24px',
        marginTop: '0',
        color: theme.palette.text.disabled
    }
}))

interface Props {
    idea: IdeaDto
}

const IdeaCard: React.FC<Props> = ({idea}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const getBeneficiaryFragment = (): string => {
        if (!idea.beneficiary) return ''
        return ellipseTextInTheMiddle(idea.beneficiary, 12)
    }

    return <Card className={classes.root}>
        <div className={classes.networkAccentLine}/>

        <Link className={classes.link}
              to={`${generatePath(ROUTE_IDEA, {ideaId: idea.id})}/${IdeaContentType.Info}`}>
            <div className={`${classes.header} ${classes.contentMargin}`}>
                <IdeaOrdinalNumber ordinalNumber={idea.ordinalNumber}/>
                <IdeaStatusIndicator ideaStatus={idea.status}/>
            </div>

            <Divider className={classes.contentMargin}/>

            <div className={`${classes.contentMargin} ${classes.details}`}>
                <p className={classes.titleLabel}>{idea.title}</p>
                {idea.networks.length > 0 ?
                    <p className={classes.networkLabel}>{`${formatNumber(idea.networks[0].value)} LOC`}</p> : null}
            </div>

            <Divider className={classes.contentMargin}/>

            <div className={`${classes.contentMargin} ${classes.beneficiaryWrapper}`}>
                <Identicon account={idea.beneficiary}/>
                <div className={classes.beneficiaryInfo}>
                    <div>
                        <p className={classes.beneficiaryValue}>
                            {getBeneficiaryFragment()}
                        </p>
                        <p className={classes.beneficiaryLabel}>{t('idea.list.card.beneficiary')}</p>
                    </div>
                </div>
            </div>
        </Link>
    </Card>
}

export default IdeaCard
