import React from "react";
import {IdeaDto} from "../ideas.api";
import {generatePath} from "react-router-dom";
import {ROUTE_IDEA} from "../../routes";
import {Divider} from "../../components/divider/Divider";
import {useTranslation} from "react-i18next";
import {IdeaContentType} from "../idea/IdeaContentTypeTabs";
import {IdeaStatusIndicator} from "../idea/status/IdeaStatusIndicator";
import {NetworkCard} from "../../components/network/NetworkCard";
import {AddressInfo} from "../../components/identicon/AddressInfo";
import {NetworkValue} from "../../components/network/NetworkValue";
import {NetworkCardTitle} from "../../components/network/NetworkCardTitle";
import {IdeaOrdinalNumber} from "./IdeaOrdinalNumber";
import {CardHeader} from "../../components/card/components/CardHeader";
import {CardDetails} from "../../components/card/components/CardDetails";

interface Props {
    idea: IdeaDto
}

export const IdeaCard = ({ idea }: Props) => {

    const { t } = useTranslation()

    return (
        <NetworkCard redirectTo={`${generatePath(ROUTE_IDEA, {ideaId: idea.id})}/${IdeaContentType.Info}`}>

            <CardHeader>
                <IdeaOrdinalNumber ordinalNumber={idea.ordinalNumber} />
                <IdeaStatusIndicator ideaStatus={idea.status} />
            </CardHeader>

            <Divider/>

            <CardDetails>
                <NetworkCardTitle title={idea.title} />
                { idea.networks.length > 0
                    ? <NetworkValue value={idea.networks[0].value} />
                    : null
                }
            </CardDetails>

            <Divider/>

            <AddressInfo label={t('idea.list.card.beneficiary')} address={idea.beneficiary} />

        </NetworkCard>
    )
}
