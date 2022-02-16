import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import InformationTip from '../components/info/InformationTip'
import Modal from '../components/modal/Modal'
import QuestionModalButtons from '../components/modal/warning-modal/QuestionModalButtons'
import QuestionModalError from '../components/modal/warning-modal/QuestionModalError'
import QuestionModalSubtitle from '../components/modal/warning-modal/QuestionModalSubtitle'
import QuestionModalTitle from '../components/modal/warning-modal/QuestionModalTitle'
import { useNetworks } from '../networks/useNetworks'
import { useSnackNotifications } from '../snack-notifications/useSnackNotifications'
import { useAccounts } from '../substrate-lib/accounts/useAccounts'
import { breakpoints } from '../theme/theme'
import { usePolkassemblyShare } from './polkassembly-posts.api'
import PolkassemblyPostPreview from './PolkassemblyPostPreview'

const useStyles = makeStyles((theme) =>
    createStyles({
        content: {
            padding: '0 2.5em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '0 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '0 0.5em',
            },
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
        },
        warning: {
            justifyContent: 'center',
        },
    }),
)

export interface PolkassemblyPostDto {
    title: string
    content: string
    onChainIndex: number
}

interface OwnProps {
    onClose: () => void
    web3address: string
    postData: PolkassemblyPostDto
}

export type PolkassemblyShareModalProps = OwnProps & MaterialDialogProps

const PolkassemblyShareModal = ({ open, onClose, web3address, postData }: PolkassemblyShareModalProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const { mutateAsync, isLoading, isError, error, reset } = usePolkassemblyShare()
    const { network } = useNetworks()
    const { open: openSnack } = useSnackNotifications()

    /*
    We need to load the accounts to be able to use them to sing the message
     */
    const { accounts } = useAccounts()

    const onSubmit = async () => {
        await mutateAsync(
            {
                account: web3address,
                details: {
                    network,
                    ...postData,
                },
            },
            {
                onSuccess: () => {
                    openSnack(t('polkassembly.share.modal.successSnackMessage'))
                    onClose()
                },
                onError: (err: any) => {
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
        <Modal
            onClose={onCloseModal}
            open={open}
            maxWidth={'md'}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            fullWidth={true}
        >
            <div className={classes.content}>
                <QuestionModalTitle title={t('polkassembly.share.modal.title')} />
                <InformationTip className={classes.warning} label={t('polkassembly.share.modal.warning')} />
                <QuestionModalSubtitle subtitle={t('polkassembly.share.modal.subtitle')} />
                <PolkassemblyPostPreview postData={postData} />
                <QuestionModalButtons
                    onClose={onCloseModal}
                    onSubmit={onSubmit}
                    submitLabel={t('polkassembly.share.modal.submit')}
                    discardLabel={t('polkassembly.share.modal.discard')}
                    disabled={isLoading}
                />
                <QuestionModalError isError={isError} error={errorMessage} />
            </div>
        </Modal>
    )
}

export default PolkassemblyShareModal
