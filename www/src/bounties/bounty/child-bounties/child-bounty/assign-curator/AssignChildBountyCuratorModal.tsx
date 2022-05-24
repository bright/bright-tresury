import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import Modal from '../../../../../components/modal/Modal'
import SubmittingTransaction from '../../../../../substrate-lib/components/SubmittingTransaction'
import Strong from '../../../../../components/strong/Strong'
import React from 'react'
import { NetworkPlanckValue } from '../../../../../util/types'
import { ROUTE_CHILD_BOUNTY } from '../../../../../routes/routes'

export interface AssignChildBountyCuratorParams {
    parentBountyBlockchainIndex: number
    blockchainIndex: number
    curator: string
    fee: NetworkPlanckValue
}

interface OwnProps {
    open: boolean
    onClose: () => void
    assignChildBountyCuratorParams: AssignChildBountyCuratorParams
}
export type AssignChildBountyCuratorModalProps = OwnProps

const AssignChildBountyCuratorModal = ({
    open,
    onClose,
    assignChildBountyCuratorParams: { parentBountyBlockchainIndex, blockchainIndex, curator, fee },
}: AssignChildBountyCuratorModalProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const onSuccess = async () => {
        history.push(
            generatePath(ROUTE_CHILD_BOUNTY, {
                bountyIndex: parentBountyBlockchainIndex,
                childBountyIndex: blockchainIndex,
            }),
        )
    }
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            fullWidth={true}
            maxWidth={'sm'}
        >
            <SubmittingTransaction
                title={t('childBounty.assignCurator.submittingTransaction.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="childBounty.assignCurator.submittingTransaction.warning"
                        values={{ curator }}
                        components={{ strong: <Strong color={'primary'} /> }}
                    />
                }
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'childBounties',
                    callable: 'proposeCurator',
                    eventSection: 'system',
                    eventMethod: 'ExtrinsicSuccess',
                    inputParams: [
                        {
                            name: 'parentBountyId',
                            value: parentBountyBlockchainIndex.toString(),
                        },
                        {
                            name: 'childBountyId',
                            value: blockchainIndex.toString(),
                        },
                        {
                            name: 'curator',
                            value: curator,
                        },
                        {
                            name: 'fee',
                            value: fee,
                        },
                    ],
                }}
            />
        </Modal>
    )
}

export default AssignChildBountyCuratorModal
