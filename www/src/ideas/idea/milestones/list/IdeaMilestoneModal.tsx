import React from 'react'
import Modal from '../../../../components/modal/Modal'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDto, IdeaMilestoneNetworkStatus, PatchIdeaMilestoneDto } from '../idea.milestones.dto'
import IdeaMilestoneForm, { IdeaMilestoneFormValues, mergeFormValuesWithIdeaMilestone } from '../form/IdeaMilestoneForm'
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
    const queryClient = useQueryClient()
    const { mutateAsync: patchIdeaMilestone, isError: isPatchIdeaMilestoneError } = usePatchIdeaMilestone()
    const {
        mutateAsync: patchIdeaMilestoneNetworks,
        isError: isPatchIdeaMilestoneNetworksError,
    } = usePatchIdeaMilestoneNetworks()

    const submitPatchIdeaMilestone = async (ideaMilestoneFromValues: IdeaMilestoneFormValues) => {
        const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = mergeFormValuesWithIdeaMilestone(
            ideaMilestoneFromValues,
            ideaMilestone,
        )

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
            .reduce(
                (acc, cur) => ({
                    ...acc,
                    [cur.id]: { value: cur.value },
                }),
                {},
            )

        await patchIdeaMilestoneNetworks(
            { ideaId: idea.id, ideaMilestoneId: ideaMilestone.id, data: networksToUpdate },
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

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" fullWidth={true} maxWidth={'md'}>
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
                    {canEdit || canEditAnyIdeaMilestoneNetwork ? (
                        <FormFooterButton type={'submit'} variant={'contained'}>
                            {t('idea.milestones.modal.form.buttons.save')}
                        </FormFooterButton>
                    ) : null}
                    <FormFooterButton type={'button'} variant={'text'} onClick={onClose}>
                        {t('idea.milestones.modal.form.buttons.cancel')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            </IdeaMilestoneForm>
        </Modal>
    )
}

export default IdeaMilestoneModal
