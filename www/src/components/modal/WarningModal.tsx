import React from 'react'
import Modal from '../../components/modal/Modal'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import Button from '../../components/button/Button'
import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import { useTranslation } from 'react-i18next'

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
            textAlign: 'center',
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
    }),
)

interface OwnProps {
    onClose: () => void
    handleFormClose?: () => void
}

export type DeleteIdeaModalProps = OwnProps & MaterialDialogProps

const WarningModal = ({ open, onClose, handleFormClose }: DeleteIdeaModalProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            fullWidth={true}
            maxWidth={'xs'}
        >
            <Box>
                <h2 className={classes.title} id="modal-title">
                    {t('components.warningModal.title')}
                </h2>
                <p className={classes.subtitle} id="modal-description">
                    {t('components.warningModal.subtitle')}
                </p>
                <Box className={classes.buttons} pt="30px" mt="auto">
                    <Button variant="text" color="primary" onClick={onClose}>
                        {t('components.warningModal.discard')}
                    </Button>
                    <Button color="primary" onClick={handleFormClose}>
                        {t('components.warningModal.close')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default WarningModal
