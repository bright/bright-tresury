import React from "react";
import {Idea} from "./ideas.api";
import {Card} from "../components/card/Card";
import {generatePath, Link} from "react-router-dom";
import {ROUTE_IDEA} from "../routes";
import {Divider} from "../components/divider/Divider";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {Status} from "../components/status/Status";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../theme/theme";

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
    beneficiaryInfo: {
        display: 'flex',
        flexDirection: 'row',
    },
    beneficiaryLabel: {
        fontSize: '1em',
        height: '1em',
        fontWeight: 600,
        marginTop: '24px',
        marginBottom: '4px'
    },
    suitorLabel: {
        fontSize: '12px',
        fontWeight: 700,
        marginBottom: '24px',
        marginTop: '0',
        color: theme.palette.text.secondary
    }
}))

interface Props {
    idea: Idea
}

const IdeaCard: React.FC<Props> = ({idea}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const statusLabel = t('idea.list.tile.statusActive')
    const statusColor = '#00BFFF'

    const getBeneficiaryFragment = (): string => {
        if (!idea.beneficiary) return ''
        const visibleCharacters = 12
        if (idea.beneficiary.length > visibleCharacters) {
            const prefix = idea.beneficiary.substring(0, visibleCharacters / 2)
            const suffix = idea.beneficiary.substring(idea.beneficiary.length - (visibleCharacters / 2))
            return `${prefix}...${suffix}`
        } else {
            return ''
        }
    }

    return <Card className={classes.root} >
        <div className={classes.networkAccentLine}/>

        <Link className={classes.link} to={generatePath(ROUTE_IDEA, {ideaId: idea.id})}>
            <div className={`${classes.header} ${classes.contentMargin}`}>
                <p className={classes.idLabel}>{idea.id}</p>
                <Status label={statusLabel} color={statusColor}/>
            </div>

            <Divider className={classes.contentMargin}/>

            <div className={`${classes.contentMargin} ${classes.details}`}>
                <p className={classes.titleLabel}>{idea.title}</p>
                {idea.networks.length > 0 ?
                    <p className={classes.networkLabel}>{`${idea.networks[0].value} LOC`}</p> : JSON.stringify(idea)}
            </div>

            <Divider className={classes.contentMargin}/>

            <div className={`${classes.contentMargin} ${classes.beneficiaryInfo}`}>
                <div>
                    <p className={classes.beneficiaryLabel}>
                        {getBeneficiaryFragment()}
                    </p>
                    <p className={classes.suitorLabel}>{t('idea.list.tile.suitor')}</p>
                </div>
            </div>
        </Link>
    </Card>
}

export default IdeaCard
