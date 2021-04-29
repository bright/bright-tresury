import React from "react";
import {IdeaDto} from "../ideas.api";
import {generatePath} from "react-router-dom";
import {ROUTE_IDEA} from "../../routes/routes";
import {Divider} from "../../components/divider/Divider";
import {useTranslation} from "react-i18next";
import {IdeaContentType} from "../idea/IdeaContentTypeTabs";
import {IdeaStatusIndicator} from "../idea/status/IdeaStatusIndicator";
import {NetworkCard} from "../../components/network/NetworkCard";
import {AddressInfoWithLabel} from "../../components/identicon/AddressInfoWithLabel";
import {NetworkValue} from "../../components/network/NetworkValue";
import {CardHeader} from "../../components/card/components/CardHeader";
import {CardDetails} from "../../components/card/components/CardDetails";
import {CardTitle} from "../../components/card/components/CardTitle";
import {OrdinalNumber} from "../../components/ordinalNumber/OrdinalNumber";

interface Props {
    idea: IdeaDto
}

export const IdeaCard = ({ idea }: Props) => {

    const { t } = useTranslation()

    return (
        <NetworkCard redirectTo={`${generatePath(ROUTE_IDEA, {ideaId: idea.id})}/${IdeaContentType.Info}`}>

            <CardHeader>
                <OrdinalNumber prefix={t('idea.ordinalNumberPrefix')} ordinalNumber={idea.ordinalNumber} />
                <IdeaStatusIndicator status={idea.status} />
            </CardHeader>

            <Divider/>

            <CardDetails>
                <CardTitle title={idea.title} />
                { idea.networks.length > 0
                    ? <NetworkValue value={idea.networks[0].value} />
                    : null
                }
            </CardDetails>

            <Divider/>

            <AddressInfoWithLabel label={t('idea.list.card.beneficiary')} address={idea.beneficiary} />

        </NetworkCard>
    )
}
