import { ChildBountyDto } from '../../../../child-bounties.dto'
import { useTranslation } from 'react-i18next'
import { useModal } from '../../../../../../../components/modal/useModal'
import { WarningButton } from '../../../../../../../components/button/Button'
import React from 'react'
import ChildBountyUnassignCuratorModal from './ChildBountyUnassignCuratorModal'
import { BountyDto } from '../../../../../../bounties.dto'

interface OwnProps {
    childBounty: ChildBountyDto
    bounty: BountyDto
    onSuccess: () => Promise<any>
}

export type ChildBountyUnassignCuratorButtonProps = OwnProps

const ChildBountyUnassignCuratorButton = ({
    childBounty,
    bounty,
    onSuccess,
}: ChildBountyUnassignCuratorButtonProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()
    const onSuccessWithClose = async () => {
        await onSuccess()
        close()
    }
    return (
        <>
            <WarningButton variant="contained" color="primary" onClick={open}>
                {t('childBounty.header.unassignCurator')}
            </WarningButton>
            <ChildBountyUnassignCuratorModal
                open={visible}
                onClose={close}
                childBounty={childBounty}
                bounty={bounty}
                onSuccess={onSuccessWithClose}
            />
        </>
    )
}
export default ChildBountyUnassignCuratorButton
