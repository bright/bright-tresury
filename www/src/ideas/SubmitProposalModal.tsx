import React, {useCallback, useEffect, useState} from 'react';
import {Trans, useTranslation} from "react-i18next";
import {Strong} from '../components/info/Info';
import {Modal} from '../components/modal/Modal';
import SubmittingTransaction from "../substrate-lib/components/SubmittingTransaction";
import {convertIdeaToProposal, IdeaDto} from './ideas.api';

export interface ExtrinsicDetails {
    extrinsicHash: string
    lastBlockHash: string
}

interface Props {
    open: boolean,
    onClose: () => void,
    idea: IdeaDto
}

const SubmitProposalModal: React.FC<Props> = ({open, onClose, idea}) => {
    const {t} = useTranslation()
    const [extrinsicDetails, setExtrinsicDetails] = useState<ExtrinsicDetails | undefined>(undefined)

    const convert = useCallback(() => {
        if (extrinsicDetails) {
            convertIdeaToProposal(extrinsicDetails, idea, idea.networks[0])
                .then((result) => {
                    console.log(result)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [extrinsicDetails, idea])

    useEffect(() => {
        convert()
    }, [convert])

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
