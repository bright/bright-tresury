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
import { ROUTE_PROPOSALS } from '../../../../routes/routes'
import { useHistory } from 'react-router-dom'

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
}

export const SubmitTurnIdeaMilestoneIntoProposalModal = ({ open, idea, ideaMilestone, onClose }: Props) => {

    const history = useHistory()

    const { t } = useTranslation()

    const [extrinsicDetails, setExtrinsicDetails] = useState<ExtrinsicDetails | null>(null)

    const turn = useCallback(() => {
        if (extrinsicDetails) {

            const turnIdeaMilestoneIntoProposalDto: TurnIdeaMilestoneIntoProposalDto = {
                ideaMilestoneNetworkId: ideaMilestone.networks[0].id,
                extrinsicHash: extrinsicDetails.extrinsicHash,
                lastBlockHash: extrinsicDetails.lastBlockHash
            }

            turnIdeaMilestoneIntoProposal(idea.id, ideaMilestone.id, turnIdeaMilestoneIntoProposalDto)
                .then((result) => console.log(result))
                .catch((err) => console.log(err))
        }
    }, [extrinsicDetails])

    useEffect(() => {
        turn()
    }, [turn])

    const goToProposals = () => {
        history.push(ROUTE_PROPOSALS)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='modal-title'
            aria-describedby='modal-description'
            fullWidth={true}
            maxWidth={'sm'}
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
                onSuccess={goToProposals}
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
                            value: (ideaMilestone.beneficiary)!,
                        },
                    ],
                }}
                setExtrinsicDetails={setExtrinsicDetails}
            />
        </Modal>
    )
}