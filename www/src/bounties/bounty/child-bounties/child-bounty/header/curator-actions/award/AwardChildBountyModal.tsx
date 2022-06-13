import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import SubmittingTransaction from '../../../../../../../substrate-lib/components/SubmittingTransaction'
import Modal from '../../../../../../../components/modal/Modal'
import { ROUTE_CHILD_BOUNTY } from '../../../../../../../routes/routes'
import Strong from '../../../../../../../components/strong/Strong'

export interface AwardChildBountyParams {
    parentBountyBlockchainIndex: number
    blockchainIndex: number
    beneficiary: string
}

interface OwnProps {
    open: boolean
    onClose: () => void
    awardChildBounty: AwardChildBountyParams
}
export type AwardChildBountyModalProps = OwnProps

const AwardChildBountyModal = ({
    open,
    onClose,
    awardChildBounty: { parentBountyBlockchainIndex, blockchainIndex, beneficiary },
}: AwardChildBountyModalProps) => {
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
                title={t('childBounty.award.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="childBounty.award.awardModal.warningMessage"
                        values={{ beneficiary }}
                        components={{ strong: <Strong color={'primary'} /> }}
                    />
                }
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'childBounties',
                    callable: 'awardChildBounty',
                    eventMethod: 'ChildBountyAwarded',
                    eventDescription: t('childBounty.award.awardModal.eventDescription'),
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
                            name: 'beneficiary',
                            value: beneficiary,
                        },
                    ],
                }}
            />
        </Modal>
    )
}

export default AwardChildBountyModal
