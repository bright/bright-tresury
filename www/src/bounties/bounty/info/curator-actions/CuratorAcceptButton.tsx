import React from 'react'
import { useTranslation } from 'react-i18next'
import { SuccessButton } from '../../../../components/button/Button'
import { useModal } from '../../../../components/modal/useModal'
import { BountyDto } from '../../../bounties.dto'
import AcceptCuratorModal from './AcceptCuratorModal'

interface OwnProps {
    bounty: BountyDto
}

export type CuratorAcceptButtonProps = OwnProps

const CuratorAcceptButton = ({ bounty }: CuratorAcceptButtonProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()

    return (
        <>
            <SuccessButton variant="contained" color="primary" onClick={open}>
                {t('bounty.header.accept')}
            </SuccessButton>
            <AcceptCuratorModal open={visible} onClose={close} bounty={bounty} />
        </>
    )
}

export default CuratorAcceptButton
