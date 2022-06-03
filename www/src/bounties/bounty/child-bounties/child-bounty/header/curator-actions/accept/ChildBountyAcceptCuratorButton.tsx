import { useTranslation } from 'react-i18next'
import { useModal } from '../../../../../../../components/modal/useModal'
import { SuccessButton } from '../../../../../../../components/button/Button'
import React from 'react'
import ChildBountyAcceptCuratorModal from './ChildBountyAcceptCuratorModal'
import { ChildBountyDto } from '../../../../child-bounties.dto'

interface OwnProps {
    childBounty: ChildBountyDto
}
export type ChildBountyAcceptCuratorButtonProps = OwnProps

const ChildBountyAcceptCuratorButton = ({ childBounty }: ChildBountyAcceptCuratorButtonProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()

    return (
        <>
            <SuccessButton variant="contained" color="primary" onClick={open}>
                {t('childBounty.header.acceptCurator')}
            </SuccessButton>
            <ChildBountyAcceptCuratorModal open={visible} onClose={close} childBounty={childBounty} />
        </>
    )
}

export default ChildBountyAcceptCuratorButton
