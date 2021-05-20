import React from 'react'
import { useGetIdeaMilestones } from './idea.milestones.api'
import { EmptyIdeaMilestonesArrayInfo } from './components/IdeaEmptyMilestonesArrayInfo'
import { IdeaMilestoneCreateModal } from './create/IdeaMilestoneCreateModal'
import { IdeaDto } from '../../ideas.dto'
import { IdeaMilestonesList } from './list/IdeaMilestonesList'
import { LoadingWrapper } from '../../../components/loading/LoadingWrapper'
import { CreateIdeaMilestoneButton } from './components/CreateIdeaMilestoneButton'
import { useTranslation } from 'react-i18next'
import { useModal } from '../../../components/modal/useModal'

interface Props {
    idea: IdeaDto
    canEdit: boolean
}

export const IdeaMilestones = ({ idea, canEdit }: Props) => {
    const { t } = useTranslation()

    const createModal = useModal()

    const { status, data: ideaMilestones } = useGetIdeaMilestones(idea.id)

    return (
        <LoadingWrapper status={status} error={t('errors.errorOccurredWhileLoadingIdeaMilestones')}>
            {ideaMilestones ? (
                <>
                    {ideaMilestones.length === 0 ? <EmptyIdeaMilestonesArrayInfo /> : null}
                    {canEdit ? (
                        <CreateIdeaMilestoneButton
                            text={t('idea.milestones.createMilestone')}
                            onClick={createModal.open}
                        />
                    ) : null}
                    <IdeaMilestonesList idea={idea} ideaMilestones={ideaMilestones} canEdit={canEdit} />
                    <IdeaMilestoneCreateModal open={createModal.visible} idea={idea} onClose={createModal.close} />
                </>
            ) : null}
        </LoadingWrapper>
    )
}
