import React, { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import Modal from '../../components/modal/Modal'
import Strong from '../../components/strong/Strong'
import { useNetworks } from '../../networks/useNetworks'
import { ROUTE_BOUNTIES, ROUTE_BOUNTY } from '../../routes/routes'
import SubmittingTransaction, { ExtrinsicDetails } from '../../substrate-lib/components/SubmittingTransaction'
import { toNetworkPlanckValue } from '../../util/quota.util'
import { useCreateBounty } from '../bounties.api'
import { CreateBountyDto } from '../bounties.dto'
import { BountyCreateFormValues } from './BountyCreateForm'

interface OwnProps {
    open: boolean
    onClose: () => void
    bounty: BountyCreateFormValues
}

export type SubmitBountyModalProps = OwnProps

const SubmitBountyModal = ({ open, onClose, bounty }: SubmitBountyModalProps) => {
    const { t } = useTranslation()

    const history = useHistory()

    const { mutateAsync } = useCreateBounty()
    const { network } = useNetworks()
    const goToBounties = (event?: any) => {
        const bountyIndex = event?.data?.toJSON()?.[0]
        bountyIndex !== undefined
            ? history.push(generatePath(ROUTE_BOUNTY, { bountyIndex }), { share: true })
            : history.push(ROUTE_BOUNTIES)
    }

    const onTransactionSigned = useCallback(
        async ({ extrinsicHash, lastBlockHash, signerAddress }: ExtrinsicDetails) => {
            if (bounty) {
                const params: CreateBountyDto = {
                    ...bounty,
                    networkId: network.id,
                    proposer: signerAddress,
                    extrinsicHash,
                    lastBlockHash,
                    value: toNetworkPlanckValue(bounty.value, network.decimals)!,
                }
                await mutateAsync(params)
            }
        },
        [bounty, mutateAsync, network.id, network.decimals],
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
                title={t('bounty.create.submitModal.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="bounty.create.submitModal.warningMessage"
                        components={{
                            strong: <Strong color={'primary'} />,
                        }}
                    />
                }
                onSuccess={goToBounties}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'bounties',
                    callable: 'proposeBounty',
                    eventMethod: 'BountyProposed',
                    eventDescription: t('bounty.create.submitModal.eventDescription'),
                    inputParams: [
                        {
                            name: 'value',
                            value: toNetworkPlanckValue(bounty.value, network.decimals)!,
                            type: 'Compact<Balance>',
                        },
                        {
                            name: 'description',
                            value: bounty.blockchainDescription,
                        },
                    ],
                }}
                onTransactionSigned={onTransactionSigned}
            />
        </Modal>
    )
}

export default SubmitBountyModal
