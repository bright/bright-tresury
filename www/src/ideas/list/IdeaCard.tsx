import React from 'react'
import { useNetworks } from '../../networks/useNetworks'
import { IdeaDto } from '../ideas.dto'
import { generatePath } from 'react-router-dom'
import { ROUTE_IDEA } from '../../routes/routes'
import Divider from '../../components/divider/Divider'
import { useTranslation } from 'react-i18next'
import IdeaStatusIndicator from '../idea/status/IdeaStatusIndicator'
import NetworkCard from '../../components/network/NetworkCard'
import AddressInfoWithLabel from '../../components/identicon/AddressInfoWithLabel'
import NetworkValue from '../../components/network/NetworkValue'
import CardHeader from '../../components/card/components/CardHeader'
import CardDetails from '../../components/card/components/CardDetails'
import CardTitle from '../../components/card/components/CardTitle'
import OrdinalNumber from '../../components/ordinalNumber/OrdinalNumber'
import { IdeaContentType } from '../idea/Idea'
import { toNetworkDisplayValue } from '../../util/quota.util'

interface OwnProps {
    idea: IdeaDto
}

export type IdeaCardProps = OwnProps

const IdeaCard = ({
    idea: {
        id,
        ordinalNumber,
        details: { title },
        currentNetwork,
        additionalNetworks,
        beneficiary,
    },
    idea,
}: IdeaCardProps) => {
    const { t } = useTranslation()
    const { network, networks: contextNetworks } = useNetworks()

    const networks = contextNetworks.filter((contextNetwork) =>
        [...additionalNetworks, currentNetwork].find((ideaNetwork) => ideaNetwork.name === contextNetwork.id),
    )

    return (
        <NetworkCard
            redirectTo={`${generatePath(ROUTE_IDEA, { ideaId: id })}/${IdeaContentType.Info}`}
            networks={networks}
        >
            <CardHeader>
                <OrdinalNumber prefix={t('idea.ordinalNumberPrefix')} ordinalNumber={ordinalNumber} />
                <IdeaStatusIndicator idea={idea} />
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={title} />
                <NetworkValue value={toNetworkDisplayValue(currentNetwork.value, network.decimals)} />
            </CardDetails>

            <Divider />

            <AddressInfoWithLabel label={t('idea.list.card.beneficiary')} address={beneficiary} />
        </NetworkCard>
    )
}

export default IdeaCard
