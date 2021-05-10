import React from 'react'
import { IdeaMilestoneDto, patchIdeaMilestone, PatchIdeaMilestoneDto } from '../idea.milestones.api'
import { Button } from '../../../../components/button/Button'
import { Modal } from '../../../../components/modal/Modal'
import { Trans, useTranslation } from 'react-i18next'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { IdeaMilestoneForm, IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { IdeaDto } from '../../../ideas.api'

const useStyles = makeStyles(createStyles({
    title: {
        textAlign: 'center'
    },
    description: {
        textAlign: 'center',
        margin: '1em 0 2em 0',
        fontSize: '15px',
    }
}))

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onSuccessfulPatch: (ideaMilestone: IdeaMilestoneDto) => void
}

export const TurnIdeaMilestoneIntoProposalModal = (
    { open, idea, ideaMilestone, onClose, onSuccessfulPatch }: Props
) => {

    const classes = useStyles()

    const { t } = useTranslation()

    const submit = ({ beneficiary, networks }: IdeaMilestoneFormValues) => {

        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
            ...ideaMilestone,
            beneficiary,
            networks
        }

        patchIdeaMilestone(idea.id, ideaMilestone.id, patchIdeaMilestoneDto)
            .then((result) => {
                onSuccessfulPatch(result)
            })
            .catch((err) => {
                // TODO: Use common API calls error handler when it will be ready
                console.log(err)
            })
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby='modal-description'
            fullWidth={true}
            maxWidth={'xs'}
        >
            <>
                <h2 id='modal-title' className={classes.title}>
                    <Trans
                        i18nKey="idea.milestones.turnIntoProposal.areYouSureYouWantToTurnIdeaMilestoneIntoProposal"
                        values={{
                            ideaMilestoneSubject: ideaMilestone.subject
                        }}
                    />
                </h2>

                <p id='modal-description' className={classes.description}>
                    { t('idea.milestones.turnIntoProposal.makeSureYouHaveAllDataCorrectBeforeTurnIntoProposal')}
                </p>

                <IdeaMilestoneForm
                    idea={idea}
                    ideaMilestone={ideaMilestone}
                    readonly={false}
                    folded={true}
                    extendedValidation={true}
                    onSubmit={submit}
                >
                    <Button type='button' color='primary' variant='text' onClick={onClose}>
                        { t('idea.milestones.modal.form.buttons.cancel') }
                    </Button>

                    <Button type='submit' color='primary'>
                        { t('idea.details.header.turnIntoProposal') }
                    </Button>
                </IdeaMilestoneForm>
            </>
        </Modal>
    )
}
