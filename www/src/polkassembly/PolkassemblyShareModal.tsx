import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import InformationTip from '../components/info/InformationTip'
import QuestionModal from '../components/modal/warning-modal/QuestionModal'
import QuestionModalButtons from '../components/modal/warning-modal/QuestionModalButtons'
import QuestionModalError from '../components/modal/warning-modal/QuestionModalError'
import QuestionModalSubtitle from '../components/modal/warning-modal/QuestionModalSubtitle'
import QuestionModalTitle from '../components/modal/warning-modal/QuestionModalTitle'
import { ProposalDto } from '../proposals/proposals.dto'
import { useAccounts } from '../substrate-lib/accounts/useAccounts'
import { usePolkassemblyShare } from './polkasseblyShare.api'

const useStyles = makeStyles(() =>
    createStyles({
        warning: {
            justifyContent: 'center',
        },
    }),
)

interface OwnProps {
    onClose: () => void
    proposal: ProposalDto
}

export type PolkassemblyShareModalProps = OwnProps & MaterialDialogProps

const PolkassemblyShareModal = ({ open, onClose, proposal }: PolkassemblyShareModalProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const { mutateAsync, isLoading, isError, error, reset } = usePolkassemblyShare()

    /*
    We need to load the accounts to be able to use them to sing the message
     */
    const { accounts } = useAccounts()

    const onSubmit = async () => {
        await mutateAsync(
            { account: proposal.proposer.address },
            {
                onError: (err) => {
                    if ((err as any).message?.includes('web3FromAddress')) {
                        console.log('show error')
                    }
                },
            },
        )
    }

    const errorMessage = useMemo(
        () =>
            (error as any)?.message?.includes('web3FromAddress')
                ? t('polkassembly.share.modal.notProposerError')
                : t('polkassembly.share.modal.generalError'),
        [error],
    )

    const onCloseModal = () => {
        onClose()
        // reset the query, so that the errors will not show again on next modal open
        reset()
    }

    return (
        <QuestionModal onClose={onCloseModal} open={open} maxWidth={'md'}>
            <QuestionModalTitle title={t('polkassembly.share.modal.title')} />
            <InformationTip className={classes.warning} label={t('polkassembly.share.modal.warning')} />
            <QuestionModalSubtitle subtitle={t('polkassembly.share.modal.subtitle')} />
            <QuestionModalButtons
                onClose={onClose}
                onSubmit={onSubmit}
                submitLabel={t('polkassembly.share.modal.submit')}
                discardLabel={t('polkassembly.share.modal.discard')}
                disabled={isLoading}
            />
            <QuestionModalError isError={isError} error={errorMessage} />
        </QuestionModal>
    )
}

export default PolkassemblyShareModal
