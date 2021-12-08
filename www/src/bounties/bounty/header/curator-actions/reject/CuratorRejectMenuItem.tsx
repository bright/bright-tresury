import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from '../../../../../components/modal/useModal'
import { BountyDto } from '../../../../bounties.dto'
import { useBounty } from '../../../useBounty'
import RejectCuratorModal from './RejectCuratorModal'

interface OwnProps {
    bounty: BountyDto
}

export type CuratorRejectMenuItemProps = OwnProps

const CuratorRejectMenuItem = ({ bounty }: CuratorRejectMenuItemProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()
    const { canReject } = useBounty(bounty)

    return (
        <>
            <MenuItem key={'Reject'} onClick={open} disabled={!canReject}>
                {t('bounty.header.rejectCuratorRole')}
            </MenuItem>
            <RejectCuratorModal open={visible} onClose={close} bounty={bounty} />
        </>
    )
}

export default CuratorRejectMenuItem
