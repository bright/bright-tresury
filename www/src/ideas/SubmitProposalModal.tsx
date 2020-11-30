import {createStyles, makeStyles} from '@material-ui/core/styles';
import React from 'react';
import {Trans, useTranslation} from "react-i18next";
import {Info, Strong} from '../components/info/Info';
import {Modal} from '../components/modal/Modal';
import TxSignAndSubmitForm from '../substrate-lib/components/TxSignAndSubmitForm';
import {Idea} from './ideas.api';

const useStyles = makeStyles(() =>
    createStyles({
        h2: {
            textAlign: 'center'
        },
        info: {
            margin: 20,
        }
    }),
);

interface Props {
    open: boolean,
    onClose: () => void,
    idea: Idea
}

const SubmitProposalModal: React.FC<Props> = ({open, onClose, idea}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='modal-title'
            aria-describedby='modal-description'>
            <>
                <h2 id='modal-title' className={classes.h2}>{t('idea.details.submitProposalModal.title')}</h2>
                <Info className={classes.info}>
                    <Trans id='modal-description'
                           i18nKey="idea.details.submitProposalModal.warningMessage"
                           components={{strong: <Strong/>}}
                    />
                </Info>
                <TxSignAndSubmitForm
                    onCancel={onClose}
                    network={'localhost'}
                    txAttrs={{
                        palletRpc: 'treasury',
                        callable: 'proposeSpend',
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
                    }}/>
            </>
        </Modal>
    );
}

export default SubmitProposalModal
