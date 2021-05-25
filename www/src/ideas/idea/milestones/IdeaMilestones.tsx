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
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

interface Props {
    idea: IdeaDto
    canEdit: boolean
}

export const IdeaMilestones = ({ idea, canEdit }: Props) => {
    const { t } = useTranslation()

    const classes = useSuccessfullyLoadedItemStyles()

    const createModal = useModal()

    const { status, data: ideaMilestones } = useGetIdeaMilestones(idea.id)

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingIdeaMilestones')}
            loadingText={t('loading.ideaMilestones')}
        >
            {ideaMilestones ? (
                <div className={classes.content}>
                    {ideaMilestones.length === 0 ? <EmptyIdeaMilestonesArrayInfo /> : null}
                    {canEdit ? (
                        <CreateIdeaMilestoneButton
                            text={t('idea.milestones.createMilestone')}
                            onClick={createModal.open}
                        />
                    ) : null}
                    <IdeaMilestonesList idea={idea} ideaMilestones={ideaMilestones} canEdit={canEdit} />
                    <IdeaMilestoneCreateModal open={createModal.visible} idea={idea} onClose={createModal.close} />
                </div>
            ) : null}
        </LoadingWrapper>
    )
}
