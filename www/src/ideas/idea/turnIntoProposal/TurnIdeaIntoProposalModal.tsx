import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ExtrinsicDetails } from '../../../substrate-lib/components/SubmittingTransaction'
import { useTurnIdeaIntoProposal } from '../../ideas.api'
import { IdeaDto, TurnIdeaIntoProposalDto } from '../../ideas.dto'
import SubmitProposalModal from '../../SubmitProposalModal'

interface OwnProps {
    idea: IdeaDto
    open: boolean
    onClose: () => void
}

export type TurnIdeaIntoProposalModalProps = OwnProps

const TurnIdeaIntoProposalModal = ({ idea, open, onClose }: TurnIdeaIntoProposalModalProps) => {
    const { t } = useTranslation()

    const { mutateAsync: turnMutateAsync } = useTurnIdeaIntoProposal()

    const onTurn = useCallback(
        async ({ extrinsicHash, lastBlockHash }: ExtrinsicDetails) => {
            if (idea) {
                const turnIdeaIntoProposalDto: TurnIdeaIntoProposalDto = {
                    ideaNetworkId: idea.currentNetwork.id,
                    extrinsicHash,
                    lastBlockHash,
                }
                await turnMutateAsync({ ideaId: idea.id!, data: turnIdeaIntoProposalDto })
            }
        },
        [idea, turnMutateAsync],
    )

    return (
        <SubmitProposalModal
            open={open}
            onClose={onClose}
            onTurn={onTurn}
            title={t('idea.details.submitProposalModal.title')}
            value={idea.currentNetwork.value}
            beneficiary={idea.beneficiary!.web3address!}
        />
    )
}

export default TurnIdeaIntoProposalModal
