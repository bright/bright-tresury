import React from 'react'
import { Box } from '@material-ui/core'
import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Trans, useTranslation } from 'react-i18next'
import Button from '../../../components/button/Button'
import Modal from '../../../components/modal/Modal'
import Strong from '../../../components/strong/Strong'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
        },
        title: {
            textAlign: 'center',
        },
        subtitle: {
            position: 'relative',
            marginLeft: '40px',
            marginRight: '25px',
            textAlign: 'left',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
            paddingRight: '5px',
            paddingLeft: '5px',
        },
        error: {
            color: theme.palette.error.main,
            textAlign: 'center',
        },
        strong: {
            fontWeight: 'bold',
        },
        header: {
            marginLeft: '22px',
        },
        listDot: {
            fontSize: '20px',
            position: 'relative',
            marginLeft: '-15px',
            marginTop: '-5px',
        },
        listContent: {
            display: 'block',
            marginTop: '-23px',
            fontSize: '14px',
            position: 'relative',
            marginLeft: '15px',
        },
    }),
)

interface OwnProps {
    onClose: () => void
    handleFormClose?: () => void
}

export type DeleteAccountWarningModalProps = OwnProps & MaterialDialogProps

const DeleteAccountWarningModal = ({ open, onClose, handleFormClose }: DeleteAccountWarningModalProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            fullWidth={true}
            maxWidth={'sm'}
        >
            <Box>
                <h2 className={classes.title} id="modal-title">
                    {t('account.deleteAccountWarningModal.title')}
                </h2>
                <p className={clsx(classes.subtitle, classes.header)} id="modal-description">
                    {t('account.deleteAccountWarningModal.subtitle.header')}
                </p>
                <p className={classes.subtitle} id="modal-description">
                    <li className={classes.listDot}>
                        <span className={classes.listContent}>
                            <Trans
                                id="modal-description"
                                i18nKey="account.deleteAccountWarningModal.subtitle.firstParagraph"
                                components={{
                                    strong: <Strong />,
                                }}
                            />
                        </span>
                    </li>
                </p>
                <p className={classes.subtitle} id="modal-description">
                    <li className={classes.listDot}>
                        <span className={classes.listContent}>
                            <Trans
                                id="modal-description"
                                i18nKey="account.deleteAccountWarningModal.subtitle.secondParagraph"
                                components={{
                                    strong: <Strong />,
                                }}
                            />
                        </span>
                    </li>
                </p>
                <div className={classes.buttons}>
                    <Button variant="text" color="primary" onClick={onClose}>
                        {t('account.deleteAccountWarningModal.cancel')}
                    </Button>
                    <Button color="primary" onClick={handleFormClose}>
                        {t('account.deleteAccountWarningModal.delete')}
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}

export default DeleteAccountWarningModal
