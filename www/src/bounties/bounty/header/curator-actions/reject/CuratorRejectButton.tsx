import React from 'react'
import { useTranslation } from 'react-i18next'
import { WarningButton } from '../../../../../components/button/Button'
import { useModal } from '../../../../../components/modal/useModal'
import { BountyDto } from '../../../../bounties.dto'
import RejectCuratorModal from './RejectCuratorModal'
import { useBounty } from '../../../useBounty'

interface OwnProps {
    bounty: BountyDto
}

export type CuratorRejectButtonProps = OwnProps

const CuratorRejectButton = ({ bounty }: CuratorRejectButtonProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()
    const { isCurator } = useBounty(bounty)

    return (
        <>
            <WarningButton variant="contained" color="primary" onClick={open}>
                {isCurator ? t('bounty.header.rejectCuratorRole') : t('bounty.header.reject')}
            </WarningButton>
            <RejectCuratorModal open={visible} onClose={close} bounty={bounty} />
        </>
    )
}

export default CuratorRejectButton
