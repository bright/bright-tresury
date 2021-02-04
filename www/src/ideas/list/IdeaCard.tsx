import React from "react";
import {IdeaDto} from "../ideas.api";
import {generatePath} from "react-router-dom";
import {ROUTE_IDEA} from "../../routes";
import {Divider} from "../../components/divider/Divider";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {breakpoints} from "../../theme/theme";
import {IdeaContentType} from "../idea/IdeaContentTypeTabs";
import {IdeaStatusIndicator} from "../idea/status/IdeaStatusIndicator";
import {NetworkCard} from "../../components/network/NetworkCard";
import {AddressInfo} from "../../components/identicon/AddressInfo";
import {NetworkValue} from "../../components/network/NetworkValue";
import {NetworkCardTitle} from "../../components/network/NetworkCardTitle";
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
            <NetworkCardTitle title={idea.title}/>
            {idea.networks.length > 0 ? <NetworkValue value={idea.networks[0].value}/> : null}
        </div>

        <Divider/>

        <AddressInfo label={t('idea.list.card.beneficiary')} address={idea.beneficiary}/>
    </NetworkCard>
}

export default IdeaCard
