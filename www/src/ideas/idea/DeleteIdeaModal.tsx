import React from 'react'
import Modal from '../../components/modal/Modal'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import Button from '../../components/button/Button'
import { IDEAS_QUERY_KEY_BASE, useDeleteIdea } from '../ideas.api'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import { IdeaDto } from '../ideas.dto'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../networks/useNetworks'

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
    idea: IdeaDto
    onClose: () => void
}

export type DeleteIdeaModalProps = OwnProps & MaterialDialogProps

const DeleteIdeaModal = ({ open, onClose, idea }: DeleteIdeaModalProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const { network } = useNetworks()

    const { mutateAsync: deleteIdea, isError } = useDeleteIdea()
    const queryClient = useQueryClient()

    const ideaId = idea.id

    const handleDelete = async () => {
        await deleteIdea(
            { ideaId },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEAS_QUERY_KEY_BASE, network.id])
                    history.goBack()
                },
            },
        )
    }

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
                    {t('idea.optionsMenu.deleteIdeaModal.title')}
                </h2>
                <p className={classes.subtitle} id="modal-description">
                    {t('idea.optionsMenu.deleteIdeaModal.subtitle')}
                </p>
                <Box className={classes.buttons} pt="30px" mt="auto">
                    <Button variant="text" color="primary" onClick={onClose}>
                        {t('idea.optionsMenu.discard')}
                    </Button>
                    <Button color="primary" onClick={handleDelete}>
                        {t('idea.optionsMenu.deleteIdea')}
                    </Button>
                </Box>
            </Box>
            {isError ? (
                <p className={classes.error} id="modal-error">
                    {t('idea.optionsMenu.deleteIdeaModal.error')}
                </p>
            ) : null}
        </Modal>
    )
}

export default DeleteIdeaModal
