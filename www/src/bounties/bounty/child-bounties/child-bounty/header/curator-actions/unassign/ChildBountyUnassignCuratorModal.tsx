import Modal from '../../../../../../../components/modal/Modal'
import SubmittingTransaction from '../../../../../../../substrate-lib/components/SubmittingTransaction'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { ChildBountyDto } from '../../../../child-bounties.dto'
import { useChildBounty } from '../../../../useChildBounty'
import { BountyDto } from '../../../../../../bounties.dto'

enum UnassignSource {
    BountyCurator,
    ChildBountyCurator,
    Community,
}
const WARNING_MESSAGES = {
    [UnassignSource.BountyCurator]: 'childBounty.unassignCurator.submittingTransaction.warningMessageAsBountyCurator',
    [UnassignSource.ChildBountyCurator]:
        'childBounty.unassignCurator.submittingTransaction.warningMessageAsChildBountyCurator',
    [UnassignSource.Community]: 'childBounty.unassignCurator.submittingTransaction.warningMessageAsCommunity',
}
interface OwnProps {
    open: boolean
    onClose: () => void
    onSuccess: () => Promise<any>
    childBounty: ChildBountyDto
    bounty: BountyDto
}

export type ChildBountyUnassignCuratorModalProps = OwnProps

const ChildBountyUnassignCuratorModal = ({
    open,
    onClose,
    childBounty,
    bounty,
    onSuccess,
}: ChildBountyUnassignCuratorModalProps) => {
    const { t } = useTranslation()

    const {
        canUnassignCuratorByBountyCurator,
        canUsassignCuratorByChildBountyCurator,
        canUnassignCuratorByCommunity,
    } = useChildBounty(bounty, childBounty)
    //NOTE: order matters
    const unassignSource = canUsassignCuratorByChildBountyCurator
        ? UnassignSource.ChildBountyCurator
        : canUnassignCuratorByBountyCurator
        ? UnassignSource.BountyCurator
        : canUnassignCuratorByCommunity
        ? UnassignSource.Community
        : undefined
    const warningMessage = unassignSource !== undefined ? t(WARNING_MESSAGES[unassignSource]) : ''

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                fullWidth={true}
                maxWidth={'sm'}
            >
                <SubmittingTransaction
                    title={t('childBounty.unassignCurator.submittingTransaction.title')}
                    instruction={warningMessage}
                    onSuccess={onSuccess}
                    onClose={onClose}
                    txAttrs={{
                        palletRpc: 'childBounties',
                        callable: 'unassignCurator',
                        eventSection: 'system',
                        eventMethod: 'ExtrinsicSuccess',
                        eventDescription: t('childBounty.unassignCurator.submittingTransaction.eventDescription'),
                        inputParams: [
                            {
                                name: 'parentBountyId',
                                value: childBounty.parentBountyBlockchainIndex.toString(),
                            },
                            {
                                name: 'childBountyId',
                                value: childBounty.blockchainIndex.toString(),
                            },
                        ],
                    }}
                />
            </Modal>
        </>
    )
}
export default ChildBountyUnassignCuratorModal
