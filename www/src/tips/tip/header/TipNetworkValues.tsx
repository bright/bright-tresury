import React from 'react'
import { TipDto, TipStatus } from '../../tips.dto'
import NetworkRewardDeposit from '../../../components/network/NetworkRewardDeposit'
import { useTranslation } from 'react-i18next'
import useTipValue from '../../list/useTipValue'

interface OwnProps {
    tip: TipDto
}
export type FindersFeeProps = OwnProps

const getFindersFeeLabel = (tip: TipDto) => {
    if (!tip.findersFee || TipStatus.Proposed) return 'tip.info.findersFee.na'
    if (tip.status === TipStatus.Tipped || tip.status === TipStatus.Closing)
        return 'tip.info.findersFee.currentTipValue'
    return 'tip.info.findersFee.finalTipValue'
}

const TipsNetworkValues = ({ tip }: FindersFeeProps) => {
    const { t } = useTranslation()
    const { tipValue, findersFee } = useTipValue(tip)

    return (
        <NetworkRewardDeposit
            values={[
                { value: findersFee, label: t(getFindersFeeLabel(tip)) },
                { value: tipValue, label: t('tip.info.beneficiaryTipValue') },
            ]}
        />
    )
}

export default TipsNetworkValues
