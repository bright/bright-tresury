import React, { useCallback } from 'react'
import StyledSmallAmount from '../../../../../components/amount/StyledSmallAmount'
import User from '../../../../../components/user/User'
import { useNetworks } from '../../../../../networks/useNetworks'
import { toFixedDecimals, toNetworkDisplayValue } from '../../../../../util/quota.util'
import { NetworkPlanckValue } from '../../../../../util/types'
import { TippingDto } from '../../../../tips.dto'
import TippingContainer from './TippingContainer'

interface OwnProps {
    tipping: TippingDto
}

export type TippingProps = OwnProps

const Tipping = ({ tipping: { tipper, value } }: TippingProps) => {
    const { network } = useNetworks()

    const fixedDecimalsValue = useCallback(
        (val: NetworkPlanckValue) => toFixedDecimals(toNetworkDisplayValue(val, network.decimals), 4),
        [network],
    )

    return (
        <TippingContainer>
            <User user={tipper} />
            <StyledSmallAmount amount={fixedDecimalsValue(value)} currency={network.currency} />
        </TippingContainer>
    )
}

export default Tipping
