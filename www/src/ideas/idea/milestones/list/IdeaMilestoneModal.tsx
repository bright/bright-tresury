import React from 'react'
import Modal from '../../../../components/modal/Modal'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDto, IdeaMilestoneNetworkStatus, PatchIdeaMilestoneDto } from '../idea.milestones.dto'
import IdeaMilestoneForm from '../form/IdeaMilestoneForm'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import { useTranslation } from 'react-i18next'
import FormFooterErrorBox from '../../../../components/form/footer/FormFooterErrorBox'
import { useIdeaMilestone } from '../useIdeaMilestone'
import {
    IDEA_MILESTONES_QUERY_KEY_BASE,
    usePatchIdeaMilestone,
    usePatchIdeaMilestoneNetworks,
} from '../idea.milestones.api'
import { useQueryClient } from 'react-query'
import { useNetworks } from '../../../../networks/useNetworks'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import { theme } from '../../../../theme/theme'
import { useModal } from '../../../../components/modal/useModal'
import DeleteIdeaMilestoneModal from './DeleteIdeaMilestoneModal'
import useIdeaMilestoneForm, { IdeaMilestoneFormValues } from '../form/useIdeaMilestoneForm'
import CloseFormWarningModal from '../../../../components/form/CloseFormWarningModal'

const useStyles = makeStyles(() =>
    createStyles({
        buttonsContainer: {
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
        },
        removeMilestone: {
            whiteSpace: 'nowrap',
            marginLeft: '10px',
            color: `${theme.palette.warning.main}`,
        },
        cancelButton: {
            marginRight: '40px',
        },
    }),
)

interface OwnProps {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onTurnIntoProposalClick: (ideaMilestone: IdeaMilestoneDto) => void
}

export type IdeaMilestoneModalProps = OwnProps

const IdeaMilestoneModal = ({
    open,
    idea,
    ideaMilestone,
    onClose,
    onTurnIntoProposalClick,
}: IdeaMilestoneModalProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { canEdit, canEditAnyIdeaMilestoneNetwork } = useIdeaMilestone(idea, ideaMilestone)
    const classes = useStyles()
    const deleteIdeaMilestoneModal = useModal()
    const queryClient = useQueryClient()
    const warningModal = useModal()
    const { mutateAsync: patchIdeaMilestone, isError: isPatchIdeaMilestoneError } = usePatchIdeaMilestone()
    const {
        mutateAsync: patchIdeaMilestoneNetworks,
        isError: isPatchIdeaMilestoneNetworksError,
    } = usePatchIdeaMilestoneNetworks()
    const { toIdeaMilestoneDto, toIdeaMilestoneNetworkDto } = useIdeaMilestoneForm({ idea, ideaMilestone })
    const submitPatchIdeaMilestone = async (ideaMilestoneFromValues: IdeaMilestoneFormValues) => {
        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = toIdeaMilestoneDto(ideaMilestoneFromValues)

        await patchIdeaMilestone(
            {
                ideaId: idea.id,
                ideaMilestoneId: ideaMilestone.id,
                currentNetwork: network.id,
                data: patchIdeaMilestoneDto,
            },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_MILESTONES_QUERY_KEY_BASE, idea.id])
                    onClose()
                },
            },
        )
    }

    const submitPatchIdeaMilestoneNetworks = async ({
        currentNetwork,
        additionalNetworks,
    }: IdeaMilestoneFormValues) => {
        const ideaMilestoneNetworks = [currentNetwork, ...additionalNetworks]
        const networksToUpdate = ideaMilestoneNetworks
            .filter(({ status }) => status !== IdeaMilestoneNetworkStatus.TurnedIntoProposal)
            .map(toIdeaMilestoneNetworkDto)

        await patchIdeaMilestoneNetworks(
            { ideaId: idea.id, ideaMilestoneId: ideaMilestone.id, data: { items: networksToUpdate } },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_MILESTONES_QUERY_KEY_BASE, idea.id])
                    onClose()
                },
            },
        )
    }

    const onSubmit = (ideaMilestoneFromValues: IdeaMilestoneFormValues) => {
        if (canEdit) return submitPatchIdeaMilestone(ideaMilestoneFromValues)
        if (canEditAnyIdeaMilestoneNetwork) return submitPatchIdeaMilestoneNetworks(ideaMilestoneFromValues)
        return
    }

    const handleOpenModal = () => {
        onClose()
        warningModal.close()
    }

    const openWarningModalOrClose = () => {
        canEdit ? warningModal.open() : onClose()
    }

    return (
        <>
            <Modal
                open={open}
                onClose={openWarningModalOrClose}
                aria-labelledby="modal-title"
                fullWidth={true}
                maxWidth={'md'}
            >
                <IdeaMilestoneForm
                    idea={idea}
                    ideaMilestone={ideaMilestone}
                    onTurnIntoProposalClick={onTurnIntoProposalClick}
                    onSubmit={onSubmit}
                >
                    {isPatchIdeaMilestoneError || isPatchIdeaMilestoneNetworksError ? (
                        <FormFooterErrorBox error={t('errors.somethingWentWrong')} />
                    ) : null}
                    <FormFooterButtonsContainer>
                        <div className={classes.buttonsContainer}>
                            <FormFooterButton
                                className={classes.cancelButton}
                                type={'button'}
                                variant={'text'}
                                onClick={openWarningModalOrClose}
                            >
                                {t('idea.milestones.modal.form.buttons.cancel')}
                            </FormFooterButton>
                            {canEdit || canEditAnyIdeaMilestoneNetwork ? (
                                <FormFooterButton type={'submit'} variant={'contained'}>
                                    {t('idea.milestones.modal.form.buttons.save')}
                                </FormFooterButton>
                            ) : null}
                        </div>
                        {canEdit ? (
                            <FormFooterButton
                                className={classes.removeMilestone}
                                onClick={deleteIdeaMilestoneModal.open}
                                type={'button'}
                                variant={'text'}
                                disabled={!canEdit}
                            >
                                {t('idea.milestones.modal.form.buttons.removeMilestone')}
                            </FormFooterButton>
                        ) : null}
                        <DeleteIdeaMilestoneModal
                            idea={idea}
                            ideaMilestone={ideaMilestone}
                            open={deleteIdeaMilestoneModal.visible}
                            onClose={deleteIdeaMilestoneModal.close}
                            onIdeaMilestoneModalClose={onClose}
                        />
                    </FormFooterButtonsContainer>
                </IdeaMilestoneForm>
            </Modal>
            <CloseFormWarningModal
                open={warningModal.visible}
                onClose={warningModal.close}
                handleFormClose={handleOpenModal}
            />
        </>
    )
}

export default IdeaMilestoneModal
