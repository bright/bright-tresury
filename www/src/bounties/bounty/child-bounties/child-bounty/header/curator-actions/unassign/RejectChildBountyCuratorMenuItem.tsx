import React from 'react'
import { useTranslation } from 'react-i18next'

import ChildBountyUnassignCuratorModal from './ChildBountyUnassignCuratorModal'
import { useChildBounty } from '../../../../useChildBounty'
import { ChildBountyDto } from '../../../../child-bounties.dto'
import { BountyDto } from '../../../../../../bounties.dto'
import { useModal } from '../../../../../../../components/modal/useModal'
import MenuItem from '../../../../../../../main/top-bar/account/MenuItem'
import { useGetChildBounty } from '../../../../child-bounties.api'
import { useNetworks } from '../../../../../../../networks/useNetworks'

interface OwnProps {
    childBounty: ChildBountyDto
    bounty: BountyDto
}

export type RejectChildBountyCuratorMenuItemProps = OwnProps

const RejectChildBountyCuratorMenuItem = ({ childBounty, bounty }: RejectChildBountyCuratorMenuItemProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()
    const { network } = useNetworks()
    const { canUnassignCurator } = useChildBounty(bounty, childBounty)

    const { refetch } = useGetChildBounty({
        bountyIndex: childBounty.parentBountyBlockchainIndex.toString(),
        childBountyIndex: childBounty.blockchainIndex.toString(),
        network: network.id,
    })
    return (
        <>
            <MenuItem key={'AssignCurator'} onClick={open} disabled={!canUnassignCurator}>
                {t('childBounty.header.unassignCurator')}
            </MenuItem>
            <ChildBountyUnassignCuratorModal
                open={visible}
                onClose={close}
                childBounty={childBounty}
                bounty={bounty}
                onSuccess={async () => {
                    await refetch()
                    close()
                }}
            />
        </>
    )
}
export default RejectChildBountyCuratorMenuItem
