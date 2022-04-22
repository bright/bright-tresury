import MenuItem from '../../../main/top-bar/account/MenuItem'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTip } from '../useTip'
import { TipDto } from '../../tips.dto'
import { useModal } from '../../../components/modal/useModal'
import TipCancelModal from './TipCancelModal'

interface OwnProps {
    tip: TipDto
}

export type TipCancelMenuItemProps = OwnProps

const TipCancelMenuItem = ({ tip }: TipCancelMenuItemProps) => {
    const { t } = useTranslation()
    const { canCancelTip } = useTip(tip)
    const { visible: isCancelModalOpen, open: openCancelModal, close: closeCancelModal } = useModal()
    return (
        <>
            <MenuItem key={'tipCancel'} disabled={!canCancelTip} onClick={openCancelModal}>
                {t('tip.tipCancel.title')}
            </MenuItem>
            <TipCancelModal visible={isCancelModalOpen} onClose={closeCancelModal} tip={tip} />
        </>
    )
}
export default TipCancelMenuItem
