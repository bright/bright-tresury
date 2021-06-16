import React from 'react'
import { IdeaDto } from '../ideas.dto'
import { generatePath } from 'react-router-dom'
import { ROUTE_IDEA } from '../../routes/routes'
import Divider from '../../components/divider/Divider'
import { useTranslation } from 'react-i18next'
import { IdeaContentType } from '../idea/IdeaContentTypeTabs'
import { IdeaStatusIndicator } from '../idea/status/IdeaStatusIndicator'
import NetworkCard from '../../components/network/NetworkCard'
import AddressInfoWithLabel from '../../components/identicon/AddressInfoWithLabel'
import NetworkValue from '../../components/network/NetworkValue'
import CardHeader from '../../components/card/components/CardHeader'
import CardDetails from '../../components/card/components/CardDetails'
import CardTitle from '../../components/card/components/CardTitle'
import OrdinalNumber from '../../components/ordinalNumber/OrdinalNumber'

export interface OwnProps {
    idea: IdeaDto
}

export type IdeaCardProps = OwnProps

const IdeaCard = ({ idea: { id, ordinalNumber, status, title, networks, beneficiary } }: IdeaCardProps) => {
    const { t } = useTranslation()

    return (
        <NetworkCard redirectTo={`${generatePath(ROUTE_IDEA, { ideaId: id })}/${IdeaContentType.Info}`}>
            <CardHeader>
                <OrdinalNumber prefix={t('idea.ordinalNumberPrefix')} ordinalNumber={ordinalNumber} />
                <IdeaStatusIndicator status={status} />
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={title} />
                {networks.length > 0 ? <NetworkValue value={networks[0].value} /> : null}
            </CardDetails>

            <Divider />

            <AddressInfoWithLabel label={t('idea.list.card.beneficiary')} address={beneficiary} />
        </NetworkCard>
    )
}

export default IdeaCard
