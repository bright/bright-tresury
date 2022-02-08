import React from 'react'
import Modal from '../../../../components/modal/Modal'
import { IdeaDto } from '../../../ideas.dto'
import IdeaMilestoneForm from '../form/IdeaMilestoneForm'
import FormFooterErrorBox from '../../../../components/form/footer/FormFooterErrorBox'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import { useTranslation } from 'react-i18next'
import { IDEA_MILESTONES_QUERY_KEY_BASE, useCreateIdeaMilestone } from '../idea.milestones.api'
import { useQueryClient } from 'react-query'
import { CreateIdeaMilestoneDto } from '../idea.milestones.dto'
import useIdeaMilestoneForm, { IdeaMilestoneFormValues } from '../form/useIdeaMilestoneForm'
import CloseFormWarningModal from '../../../../components/form/CloseFormWarningModal'
import { useModal } from '../../../../components/modal/useModal'

interface OwnProps {
    open: boolean
    idea: IdeaDto
    onClose: () => void
}

export type IdeaMilestoneCreateModalProps = OwnProps

const IdeaMilestoneCreateModal = ({ open, idea, onClose }: IdeaMilestoneCreateModalProps) => {
    const { t } = useTranslation()

    const { mutateAsync, isError } = useCreateIdeaMilestone()
    const { toIdeaMilestoneNetworkDto } = useIdeaMilestoneForm({ idea })
    const queryClient = useQueryClient()
    const warningModal = useModal()

    const submit = async ({
        beneficiary,
        currentNetwork,
        additionalNetworks,
        subject,
        description,
        dateFrom,
        dateTo,
    }: IdeaMilestoneFormValues) => {
        const dto: CreateIdeaMilestoneDto = {
            beneficiary,
            currentNetwork: toIdeaMilestoneNetworkDto(currentNetwork),
            additionalNetworks: additionalNetworks.map(toIdeaMilestoneNetworkDto),
            details: {
                subject,
                description,
                dateFrom,
                dateTo,
            },
        }

        await mutateAsync(
            { ideaId: idea.id, data: dto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_MILESTONES_QUERY_KEY_BASE, idea.id])
                    onClose()
                },
            },
        )
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
                fullWidth={true}
                maxWidth={'md'}
            >
                <IdeaMilestoneForm idea={idea} onSubmit={submit}>
                    {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}

                    <FormFooterButtonsContainer>
                        <FormFooterButton type={'submit'} variant={'contained'}>
                            {t('idea.milestones.modal.form.buttons.create')}
                        </FormFooterButton>

                        <FormFooterButton type={'button'} variant={'text'} onClick={onClose}>
                            {t('idea.milestones.modal.form.buttons.cancel')}
                        </FormFooterButton>
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

export default IdeaMilestoneCreateModal
