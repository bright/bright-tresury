import React, {useCallback, useEffect, useState} from "react";
import {Modal} from "../../../../components/modal/Modal";
import {Trans, useTranslation} from "react-i18next";
import {IdeaDto} from "../../../ideas.api";
import {ExtrinsicDetails} from "../../../SubmitProposalModal";
import SubmittingTransaction from "../../../../substrate-lib/components/SubmittingTransaction";
import {Strong} from "../../../../components/info/Info";
import {
    convertIdeaMilestoneToProposal,
    ConvertIdeaMilestoneToProposalDto,
    IdeaMilestoneDto
} from "../idea.milestones.api";

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onSuccess: () => void
    onClose: () => void
}

export const SubmitConvertIdeaMilestoneToProposalModal = ({ open, idea, ideaMilestone, onSuccess, onClose }: Props) => {

    const { t } = useTranslation()

    const [extrinsicDetails, setExtrinsicDetails] = useState<ExtrinsicDetails | null>(null)

    const convert = useCallback(() => {
        if (extrinsicDetails) {

            const convertIdeaMilestoneToProposalDto: ConvertIdeaMilestoneToProposalDto = {
                ideaMilestoneNetworkId: ideaMilestone.networks[0].id,
                extrinsicHash: extrinsicDetails.extrinsicHash,
                lastBlockHash: extrinsicDetails.lastBlockHash
            }

            convertIdeaMilestoneToProposal(idea.id, ideaMilestone.id, ideaMilestone.networks[0].id, convertIdeaMilestoneToProposalDto)
                .then((result) => console.log(result))
                .catch((err) => console.log(err))
        }
    }, [extrinsicDetails])

    useEffect(() => {
        convert()
    }, [convert])

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='modal-title'
            aria-describedby='modal-description'
            maxWidth={'md'}
        >
            <SubmittingTransaction
                title={t('idea.milestones.convertToProposal.submit.title')}
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