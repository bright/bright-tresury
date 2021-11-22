import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../../../components/button/Button'
import { useModal } from '../../../../../components/modal/useModal'
import { BountyDto } from '../../../../bounties.dto'
import ClaimPayoutModal from './ClaimPayoutModal'

interface OwnProps {
    bounty: BountyDto
}

export type CuratorRejectButtonProps = OwnProps

const ClaimPayoutButton = ({ bounty }: CuratorRejectButtonProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()

    return (
        <>
            <Button variant="contained" color="primary" onClick={open}>
                {t('bounty.header.claimPayout')}
            </Button>
            <ClaimPayoutModal open={visible} onClose={close} bounty={bounty} />
        </>
    )
}

export default ClaimPayoutButton
