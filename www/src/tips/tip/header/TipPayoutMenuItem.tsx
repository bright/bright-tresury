import MenuItem from '../../../main/top-bar/account/MenuItem'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTip } from '../useTip'
import { TipDto } from '../../tips.dto'
import TipPayoutModal from './TipPayoutModal'
import { useModal } from '../../../components/modal/useModal'

interface OwnProps {
    tip: TipDto
}

export type TipPayoutMenuItemProps = OwnProps

const TipPayoutMenuItem = ({ tip }: TipPayoutMenuItemProps) => {
    const { t } = useTranslation()
    const { canCloseTip } = useTip(tip)
    const { visible: isPayoutModalOpen, open: openPayoutModal, close: closePayoutModal } = useModal()
    return (
        <>
            <MenuItem key={'TipPayout'} disabled={!canCloseTip} onClick={openPayoutModal}>
                {t('tip.tipPayout.title')}
            </MenuItem>
            <TipPayoutModal visible={isPayoutModalOpen} onClose={closePayoutModal} tip={tip} />
        </>
    )
}
export default TipPayoutMenuItem
