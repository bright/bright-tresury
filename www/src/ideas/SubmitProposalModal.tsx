import React, {useCallback, useEffect, useState} from 'react';
import {Trans, useTranslation} from "react-i18next";
import {Strong} from '../components/info/Info';
import {Modal} from '../components/modal/Modal';
import SubmittingTransaction from "../substrate-lib/components/SubmittingTransaction";
import {turnIdeaIntoProposal, IdeaDto} from './ideas.api';

export interface ExtrinsicDetails {
    extrinsicHash: string
    lastBlockHash: string
}

interface Props {
    open: boolean,
    onClose: () => void,
    onSuccess?: () => void
    idea: IdeaDto
}

const SubmitProposalModal: React.FC<Props> = ({open, onClose, onSuccess, idea}) => {
    const {t} = useTranslation()
    const [extrinsicDetails, setExtrinsicDetails] = useState<ExtrinsicDetails | undefined>(undefined)

    const turn = useCallback(() => {
        if (extrinsicDetails) {
            turnIdeaIntoProposal(extrinsicDetails, idea, idea.networks[0])
                .then((result) => {
                    console.log(result)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [extrinsicDetails, idea])

    useEffect(() => {
        turn()
    }, [turn])

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='modal-title'
            aria-describedby='modal-description'>
            <SubmittingTransaction
                title={t('idea.details.submitProposalModal.title')}
                instruction={<Trans id='modal-description'
                                    i18nKey="idea.details.submitProposalModal.warningMessage"
                                    components={{strong: <Strong color={'primary'}/>}}
                />}
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
                            value: idea.networks[0].value.toString(),
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
    );
}

export default SubmitProposalModal
