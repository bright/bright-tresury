import React from 'react'
import {
    IDEA_MILESTONES_QUERY_KEY_BASE,
    usePatchIdeaMilestone,
    usePatchIdeaMilestoneNetworks,
} from '../idea.milestones.api'
import {
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto,
    IdeaMilestoneNetworkStatus,
    PatchIdeaMilestoneDto,
} from '../idea.milestones.dto'
import Modal from '../../../../components/modal/Modal'
import { Trans, useTranslation } from 'react-i18next'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import IdeaMilestoneForm from '../form/IdeaMilestoneForm'
import { IdeaDto } from '../../../ideas.dto'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import FormFooterErrorBox from '../../../../components/form/footer/FormFooterErrorBox'
import { useQueryClient } from 'react-query'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'
import { useIdeaMilestone } from '../useIdeaMilestone'
import { useNetworks } from '../../../../networks/useNetworks'
import useIdeaMilestoneForm, { IdeaMilestoneFormValues } from '../form/useIdeaMilestoneForm'
import CloseFormWarningModal from '../../../../components/form/CloseFormWarningModal'
import { useModal } from '../../../../components/modal/useModal'

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

interface OwnProps {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onSuccessfulPatch: (ideaMilestone: IdeaMilestoneDto) => void
}

export type TurnIdeaMilestoneIntoProposalModalProps = OwnProps

const TurnIdeaMilestoneIntoProposalModal = ({
    open,
    idea,
    ideaMilestone,
    onClose,
    onSuccessfulPatch,
}: TurnIdeaMilestoneIntoProposalModalProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { canEdit, canEditAnyIdeaMilestoneNetwork } = useIdeaMilestone(idea, ideaMilestone)
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
                onSuccess: async (patchedIdeaMilestoneDto) => {
                    await queryClient.refetchQueries([IDEA_MILESTONES_QUERY_KEY_BASE, idea.id])
                    onSuccessfulPatch(patchedIdeaMilestoneDto)
                },
            },
        )
    }
    const updateIdeaMilestoneWithPatchedNetworks = (
        ideaMilestone: IdeaMilestoneDto,
        patchedIdeaMilestoneNetworks: IdeaMilestoneNetworkDto[],
    ) => {
        const patchedIdeaMilestone = { ...ideaMilestone }
        const additionalNetworksIds = patchedIdeaMilestone.additionalNetworks.map(({ id }) => id)
        for (const patchedIdeaMilestoneNetwork of patchedIdeaMilestoneNetworks) {
            const patchedMilestoneId = patchedIdeaMilestoneNetwork.id
            const additionalNetworkId = additionalNetworksIds.indexOf(patchedMilestoneId)
            if (patchedIdeaMilestone.currentNetwork.id === patchedMilestoneId)
                patchedIdeaMilestone.currentNetwork = patchedIdeaMilestoneNetwork
            else if (additionalNetworkId !== -1)
                patchedIdeaMilestone.additionalNetworks[additionalNetworkId] = patchedIdeaMilestoneNetwork
        }
        return patchedIdeaMilestone
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
                onSuccess: async (patchedIdeaMilestoneNetworks: IdeaMilestoneNetworkDto[]) => {
                    await queryClient.refetchQueries([IDEA_MILESTONES_QUERY_KEY_BASE, idea.id])
                    onSuccessfulPatch(
                        updateIdeaMilestoneWithPatchedNetworks(ideaMilestone, patchedIdeaMilestoneNetworks),
                    )
                },
            },
        )
    }

    const onSubmit = async (ideaMilestoneFormValues: IdeaMilestoneFormValues) => {
        if (canEdit) return await submitPatchIdeaMilestone(ideaMilestoneFormValues)
        if (canEditAnyIdeaMilestoneNetwork) return await submitPatchIdeaMilestoneNetworks(ideaMilestoneFormValues)
        return
    }

    const handleOpenModal = () => {
        onClose()
        warningModal.close()
    }

    return (
        <>
            <Modal
                open={open}
                onClose={warningModal.open}
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
                                ideaMilestoneSubject: ideaMilestone.details.subject,
                            }}
                        />
                    </h2>

                    <p id="modal-description" className={classes.description}>
                        {t('idea.milestones.turnIntoProposal.makeSureYouHaveAllDataCorrectBeforeTurnIntoProposal')}
                    </p>

                    <IdeaMilestoneForm
                        idea={idea}
                        ideaMilestone={ideaMilestone}
                        folded={true}
                        extendedValidation={true}
                        onSubmit={onSubmit}
                    >
                        {isPatchIdeaMilestoneError || isPatchIdeaMilestoneNetworksError ? (
                            <FormFooterErrorBox error={t('errors.somethingWentWrong')} />
                        ) : null}

                        <FormFooterButtonsContainer>
                            <FormFooterButton type={'submit'} variant={'contained'}>
                                {t('idea.details.header.turnIntoProposal')}
                            </FormFooterButton>

                            <FormFooterButton type={'button'} variant={'text'} onClick={onClose}>
                                {t('idea.milestones.modal.form.buttons.cancel')}
                            </FormFooterButton>
                        </FormFooterButtonsContainer>
                    </IdeaMilestoneForm>
                </>
            </Modal>
            <CloseFormWarningModal
                open={warningModal.visible}
                onClose={warningModal.close}
                handleFormClose={handleOpenModal}
            />
        </>
    )
}

export default TurnIdeaMilestoneIntoProposalModal
