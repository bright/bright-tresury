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
}

export type ChildBountyUnassignCuratorButtonProps = OwnProps

const ChildBountyUnassignCuratorButton = ({ childBounty, bounty }: ChildBountyUnassignCuratorButtonProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()
    return (
        <>
            <WarningButton variant="contained" color="primary" onClick={open}>
                {t('childBounty.header.unassignCurator')}
            </WarningButton>
            <ChildBountyUnassignCuratorModal open={visible} onClose={close} childBounty={childBounty} bounty={bounty} />
        </>
    )
}
export default ChildBountyUnassignCuratorButton
