import React from "react";
import {IdeaDto} from "../ideas.api";
import {generatePath} from "react-router-dom";
import {ROUTE_IDEA} from "../../routes";
import {Divider} from "../../components/divider/Divider";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {formatNumber} from "../../util/numberUtil";
import {IdeaContentType} from "../idea/IdeaContentTypeTabs";
import {IdeaStatusIndicator} from "../idea/status/IdeaStatusIndicator";
import {NetworkCard} from "../../components/card/NetworkCard";
import {AddressInfo} from "../../components/identicon/AddressInfo";
import config from "../../config";
import {IdeaOrdinalNumber} from "./IdeaOrdinalNumber";

const useStyles = makeStyles((theme: Theme) => createStyles({
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
    }
}))

interface Props {
    idea: IdeaDto
}

const IdeaCard: React.FC<Props> = ({idea}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <NetworkCard
        redirectTo={`${generatePath(ROUTE_IDEA, {ideaId: idea.id})}/${IdeaContentType.Info}`}>
        <div className={classes.header}>
            <IdeaOrdinalNumber ordinalNumber={idea.ordinalNumber}/>
            <IdeaStatusIndicator ideaStatus={idea.status}/>
        </div>
        <Divider/>
        <div className={`${classes.details}`}>
            <p className={classes.titleLabel}>{idea.title}</p>
            {idea.networks.length > 0 ?
                <p className={classes.networkLabel}>{`${formatNumber(idea.networks[0].value)} ${config.NETWORK_CURRENCY}`}</p> : null}
        </div>
        <Divider/>
        <AddressInfo label={t('idea.list.card.beneficiary')} address={idea.beneficiary}/>
    </NetworkCard>
}

export default IdeaCard
