import React from 'react'
import { usePatchIdeaMilestone } from '../idea.milestones.api'
import { IdeaMilestoneDto, PatchIdeaMilestoneDto } from '../idea.milestones.dto'
import { Modal } from '../../../../components/modal/Modal'
import { Trans, useTranslation } from 'react-i18next'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { IdeaMilestoneForm, IdeaMilestoneFormValues } from '../form/IdeaMilestoneForm'
import { IdeaDto } from '../../../ideas.dto'
import { Footer } from '../../../../components/form/footer/Footer'
import { LeftButton, RightButton } from '../../../../components/form/footer/buttons/Buttons'
import { ErrorBox } from '../../../../components/form/footer/errorBox/ErrorBox'
import { useQueryClient } from 'react-query'

const useStyles = makeStyles(
    createStyles({
        title: {
            textAlign: 'center',
        },
        description: {
            textAlign: 'center',
            margin: '1em 0 2em 0',
            fontSize: '15px',
        },
    }),
)

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onSuccessfulPatch: (ideaMilestone: IdeaMilestoneDto) => void
}

export const TurnIdeaMilestoneIntoProposalModal = ({
    open,
    idea,
    ideaMilestone,
    onClose,
    onSuccessfulPatch,
}: Props) => {
    const classes = useStyles()

    const { t } = useTranslation()

    const queryClient = useQueryClient()

    const { mutateAsync, isError } = usePatchIdeaMilestone()

    const submit = async ({ beneficiary, networks }: IdeaMilestoneFormValues) => {
        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
            ...ideaMilestone,
            beneficiary,
            networks,
        }

        await mutateAsync(
            { ideaId: idea.id, ideaMilestoneId: ideaMilestone.id, data: patchIdeaMilestoneDto },
            {
                onSuccess: async (patchedIdeaMilestone) => {
                    await queryClient.refetchQueries(['ideaMilestones', idea.id])
                    onSuccessfulPatch(patchedIdeaMilestone)
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
            <>
                <h2 id="modal-title" className={classes.title}>
                    <Trans
                        i18nKey="idea.milestones.turnIntoProposal.areYouSureYouWantToTurnIdeaMilestoneIntoProposal"
                        values={{
                            ideaMilestoneSubject: ideaMilestone.subject,
                        }}
                    />
                </h2>

                <p id="modal-description" className={classes.description}>
                    {t('idea.milestones.turnIntoProposal.makeSureYouHaveAllDataCorrectBeforeTurnIntoProposal')}
                </p>

                <IdeaMilestoneForm
                    idea={idea}
                    ideaMilestone={ideaMilestone}
                    readonly={false}
                    folded={true}
                    extendedValidation={true}
                    onSubmit={submit}
                >
                    <Footer>
                        <LeftButton type="button" variant="text" onClick={onClose}>
                            {t('idea.milestones.modal.form.buttons.cancel')}
                        </LeftButton>

                        <div>{isError ? <ErrorBox error={t('errors.somethingWentWrong')} /> : null}</div>

                        <RightButton>{t('idea.details.header.turnIntoProposal')}</RightButton>
                    </Footer>
                </IdeaMilestoneForm>
            </>
        </Modal>
    )
}
