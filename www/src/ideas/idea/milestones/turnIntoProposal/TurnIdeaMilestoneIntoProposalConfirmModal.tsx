import React from 'react'
import { IdeaMilestoneDto } from '../idea.milestones.api'
import { Button } from '../../../../components/button/Button'
import { Modal } from '../../../../components/modal/Modal'
import { useTranslation } from 'react-i18next'
import { IdeaDto } from '../../../ideas.api'
import TransactionError from '../../../../substrate-lib/components/TransactionError'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(createStyles({
    modalContent: {
        maxWidth: '400px'
    },
    modalHeader: {
        textAlign: 'center'
    },
    modalDescription: {
        textAlign: 'center',
        margin: '1em 0 2em 0',
        fontSize: '15px',
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between'
        // marginTop: '2em'
    }
}))

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onCancel: () => void
    onTurnIntoProposalClick: () => void
}

export const TurnIdeaMilestoneIntoProposalConfirmModal = (
    { open, idea, ideaMilestone, onClose, onCancel, onTurnIntoProposalClick }: Props
) => {

    const { t } = useTranslation()

    const classes = useStyles()

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby='modal-description'
            maxWidth={'xs'}
        >
            { idea.beneficiary
                ? (
                    <div className={classes.modalContent}>

                        <h2 id='modal-title' className={classes.modalHeader}>
                            Are you sure you want to convert {ideaMilestone.subject} into a proposal?
                        </h2>

                        <p id='modal-description' className={classes.modalDescription}>
                            Make sure you have all the data correct before you convert your milestone into a proposal
                        </p>

                        <div className={classes.modalButtons}>
                            <Button
                                type='button'
                                color='primary'
                                variant='text'
                                onClick={onCancel}
                            >
                                {t('idea.milestones.modal.form.buttons.cancel')}
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onTurnIntoProposalClick}>
                                {t('idea.details.header.turnIntoProposal')}
                            </Button>
                        </div>
                    </div>
                )
                : (
                    <TransactionError
                        onOk={onClose}
                        title={t('idea.milestones.turnIntoProposal.emptyBeneficiaryValidationError.title')}
                        subtitle={t('idea.milestones.turnIntoProposal.emptyBeneficiaryValidationError.subtitle')}
                    />
                )
            }
        </Modal>
    )
}
