import React, { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import Modal from '../../../../components/modal/Modal'
import Strong from '../../../../components/strong/Strong'
import { useNetworks } from '../../../../networks/useNetworks'
import { ROUTE_CHILD_BOUNTIES, ROUTE_CHILD_BOUNTY } from '../../../../routes/routes'
import SubmittingTransaction, { ExtrinsicDetails } from '../../../../substrate-lib/components/SubmittingTransaction'
import { toNetworkPlanckValue } from '../../../../util/quota.util'
import { ChildBountyCreateFormValues } from './ChildBountyCreateForm'
import { CreateChildBountyDto } from '../child-bounties.dto'
import { useCreateChildBounty } from '../child-bounties.api'

interface OwnProps {
    open: boolean
    onClose: () => void
    childBounty: ChildBountyCreateFormValues
}

export type SubmitBountyModalProps = OwnProps

const SubmitBountyModal = ({ open, onClose, childBounty }: SubmitBountyModalProps) => {
    const { t } = useTranslation()

    const history = useHistory()

    const { mutateAsync } = useCreateChildBounty()
    const { network } = useNetworks()

    const goToChildBounty = (event?: any) => {
        const [rawBountyIndex, rawChildBountyIndex] = event?.data ?? [undefined, undefined]
        const bountyIndex = rawBountyIndex?.toNumber()
        const childBountyIndex = rawChildBountyIndex?.toNumber()

        childBountyIndex !== undefined
            ? history.push(generatePath(ROUTE_CHILD_BOUNTY, { bountyIndex, childBountyIndex }), { share: true })
            : history.push(generatePath(ROUTE_CHILD_BOUNTIES, { bountyIndex }), { share: true })
    }

    const onTransactionSigned = useCallback(
        async ({ extrinsicHash, lastBlockHash }: ExtrinsicDetails) => {
            if (childBounty) {
                const params: CreateChildBountyDto = {
                    parentIndex: childBounty.parentBountyId,
                    title: childBounty.title,
                    description: childBounty.description,
                    networkId: network.id,
                    extrinsicHash,
                    lastBlockHash,
                }
                await mutateAsync(params)
            }
        },
        [childBounty, mutateAsync],
    )

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
                title={t('childBounty.create.submitModal.title')}
                instruction={''}
                onSuccess={goToChildBounty}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'childBounties',
                    callable: 'addChildBounty',
                    eventMethod: 'Added',
                    eventDescription: t('childBounty.create.submitModal.eventDescription'),
                    inputParams: [
                        {
                            name: 'parentBountyId',
                            value: childBounty.parentBountyId.toString(),
                        },
                        {
                            name: 'value',
                            value: toNetworkPlanckValue(childBounty.value, network.decimals)!,
                            type: 'Compact<Balance>',
                        },
                        {
                            name: 'description',
                            value: childBounty.blockchainDescription,
                        },
                    ],
                }}
                onTransactionSigned={onTransactionSigned}
            />
        </Modal>
    )
}

export default SubmitBountyModal
