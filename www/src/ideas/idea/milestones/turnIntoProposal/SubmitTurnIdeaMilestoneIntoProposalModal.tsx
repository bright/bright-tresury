import React, {useCallback, useEffect, useState} from "react";
import {Modal} from "../../../../components/modal/Modal";
import {Trans, useTranslation} from "react-i18next";
import {IdeaDto} from "../../../ideas.api";
import {ExtrinsicDetails} from "../../../SubmitProposalModal";
import SubmittingTransaction from "../../../../substrate-lib/components/SubmittingTransaction";
import {Strong} from "../../../../components/info/Info";
import {
    turnIdeaMilestoneIntoProposal,
    TurnIdeaMilestoneIntoProposalDto,
    IdeaMilestoneDto
} from "../idea.milestones.api";

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onSuccess: () => void
    onClose: () => void
}

export const SubmitTurnIdeaMilestoneIntoProposalModal = ({ open, idea, ideaMilestone, onSuccess, onClose }: Props) => {

    const { t } = useTranslation()

    const [extrinsicDetails, setExtrinsicDetails] = useState<ExtrinsicDetails | null>(null)

    const turn = useCallback(() => {
        if (extrinsicDetails) {

            const turnIdeaMilestoneIntoProposalDto: TurnIdeaMilestoneIntoProposalDto = {
                ideaMilestoneNetworkId: ideaMilestone.networks[0].id,
                extrinsicHash: extrinsicDetails.extrinsicHash,
                lastBlockHash: extrinsicDetails.lastBlockHash
            }

            turnIdeaMilestoneIntoProposal(idea.id, ideaMilestone.id, ideaMilestone.networks[0].id, turnIdeaMilestoneIntoProposalDto)
                .then((result) => console.log(result))
                .catch((err) => console.log(err))
        }
    }, [extrinsicDetails])

    useEffect(() => {
        turn()
    }, [turn])

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='modal-title'
            aria-describedby='modal-description'
            maxWidth={'md'}
        >
            <SubmittingTransaction
                title={t('idea.milestones.turnIntoProposal.submit.title')}
                instruction={
                    <Trans
                        id='modal-description'
                        i18nKey="idea.details.submitProposalModal.warningMessage"
                        components={{
                            strong: <Strong color={'primary'} />
                        }}
                    />
                }
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'treasury',
                    callable: 'proposeSpend',
                    eventMethod: 'Proposed',
                    eventDescription: t('idea.details.submitProposalModal.eventDescription'),
                    inputParams: [
                        {
                            name: 'value',
                            value: ideaMilestone.networks[0].value.toString(),
                            type: 'Compact<Balance>'
                        },
                        {
                            name: 'beneficiary',
                            value: idea.beneficiary,
                        },
                    ],
                }}
                setExtrinsicDetails={setExtrinsicDetails}
            />
        </Modal>
    )
}