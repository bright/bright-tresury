import { TipDto } from './tip.dto'
import NetworkCard from '../components/network/NetworkCard'
import OrdinalNumber from '../components/ordinalNumber/OrdinalNumber'
import { useTranslation } from 'react-i18next'
import CardHeader from '../components/card/components/CardHeader'
import Divider from '../components/divider/Divider'
import React from 'react'
import CardDetails from '../components/card/components/CardDetails'
import CardTitle from '../components/card/components/CardTitle'
import NetworkValue from '../components/network/NetworkValue'
import { toNetworkDisplayValue } from '../util/quota.util'
import { useNetworks } from '../networks/useNetworks'
import CardFooter from '../components/card/components/CardFooter'
import User from '../components/user/User'
import { BountyStatus } from '../bounties/bounties.dto'

interface OwnProps {
    item: TipDto
}

export type TipCardProps = OwnProps

const TipCard = ({ item: tip }: TipCardProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    return (
        <NetworkCard redirectTo={undefined}>
            <CardHeader>
                <OrdinalNumber prefix={t('tips.indexPrefix')} ordinalNumber={tip.blockchain.index} />
                <div>{`${tip.tippersCount} Tippers`}</div>
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={tip.title ?? tip.polkassembly?.title ?? tip.blockchain.description} />
                <NetworkValue value={toNetworkDisplayValue(tip.blockchain.value, network.decimals)} />
            </CardDetails>

            <Divider />

            <CardFooter>
                <User label={t('tips.list.finder')} user={tip.blockchain.finder} />
                <User label={t('tips.list.beneficiary')} user={tip.blockchain.beneficiary} />
            </CardFooter>
        </NetworkCard>
    )
}
export default TipCard
