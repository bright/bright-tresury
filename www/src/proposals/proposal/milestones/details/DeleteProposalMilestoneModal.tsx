import React from 'react'
import Modal from '../../../../components/modal/Modal'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import Button from '../../../../components/button/Button'
import { useQueryClient } from 'react-query'
import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../../../networks/useNetworks'
import { PROPOSAL_MILESTONES_QUERY_KEY_BASE, useDeleteProposalMilestone } from '../proposal.milestones.api'
import { ProposalMilestoneDto } from '../proposal.milestones.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    proposalIndex: number
    proposalMilestone: ProposalMilestoneDto
    onClose: () => void
    onParentClose: () => void
}

export type DeleteProposalMilestoneModalProps = OwnProps & MaterialDialogProps

const DeleteProposalMilestoneModal = ({
    open,
    onClose,
    onParentClose,
    proposalIndex,
    proposalMilestone,
}: DeleteProposalMilestoneModalProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const { network } = useNetworks()

    const { mutateAsync: deleteProposalMilestone, isError } = useDeleteProposalMilestone()

    const handleDeleteMilestone = async () => {
        await deleteProposalMilestone(
            { proposalIndex, milestoneId: proposalMilestone.id, network: network.id },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries([PROPOSAL_MILESTONES_QUERY_KEY_BASE, proposalIndex, network.id])
                    onClose()
                    onParentClose()
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
            <div>
                <h2 className={classes.title} id="modal-title">
                    {t('idea.milestones.modal.form.removeModal.title')}
                </h2>
                <p className={classes.subtitle} id="modal-description">
                    {t('idea.milestones.modal.form.removeModal.subtitle')}
                </p>
                <Box className={classes.buttons} pt="30px" mt="auto">
                    <Button variant="text" color="primary" onClick={onClose}>
                        {t('idea.milestones.modal.form.removeModal.discard')}
                    </Button>
                    <Button color="primary" onClick={handleDeleteMilestone}>
                        {t('idea.milestones.modal.form.removeModal.removeMilestone')}
                    </Button>
                </Box>
            </div>
            {isError ? (
                <p className={classes.error} id="modal-error">
                    {t('idea.milestones.modal.form.removeModal.error')}
                </p>
            ) : null}
        </Modal>
    )
}

export default DeleteProposalMilestoneModal
