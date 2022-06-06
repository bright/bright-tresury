import { useTranslation } from 'react-i18next'
import { useModal } from '../../../../../../../components/modal/useModal'
import { SuccessButton } from '../../../../../../../components/button/Button'
import React from 'react'
import ChildBountyAcceptCuratorModal from './ChildBountyAcceptCuratorModal'
import { ChildBountyDto } from '../../../../child-bounties.dto'

interface OwnProps {
    childBounty: ChildBountyDto
    onSuccess: () => Promise<any>
}
export type ChildBountyAcceptCuratorButtonProps = OwnProps

const ChildBountyAcceptCuratorButton = ({ childBounty, onSuccess }: ChildBountyAcceptCuratorButtonProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()
    const onSuccessWithClose = async () => {
        await onSuccess()
        close()
    }
    return (
        <>
            <SuccessButton variant="contained" color="primary" onClick={open}>
                {t('childBounty.header.acceptCurator')}
            </SuccessButton>
            <ChildBountyAcceptCuratorModal
                open={visible}
                onClose={close}
                childBounty={childBounty}
                onSuccess={onSuccessWithClose}
            />
        </>
    )
}

export default ChildBountyAcceptCuratorButton
