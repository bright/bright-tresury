import React from 'react'
import CreateMilestoneButton from '../../../milestone-details/components/CreateMilestoneButton'
import { useIdea } from '../useIdea'
import { useGetIdeaMilestones } from './idea.milestones.api'
import NoIdeaMilestonesInfo from './components/NoIdeaMilestonesInfo'
import IdeaMilestoneCreateModal from './create/IdeaMilestoneCreateModal'
import { IdeaDto } from '../../ideas.dto'
import IdeaMilestonesList from './list/IdeaMilestonesList'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useModal } from '../../../components/modal/useModal'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

interface OwnProps {
    idea: IdeaDto
}

export type IdeaMilestonesProps = OwnProps

const IdeaMilestones = ({ idea }: IdeaMilestonesProps) => {
    const { t } = useTranslation()

    const classes = useSuccessfullyLoadedItemStyles()

    const createModal = useModal()

    const { status, data: ideaMilestones } = useGetIdeaMilestones(idea.id)

    const { canEditIdeaMilestones } = useIdea(idea)

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingIdeaMilestones')}
            loadingText={t('loading.ideaMilestones')}
        >
            {ideaMilestones ? (
                <div className={classes.content}>
                    {ideaMilestones.length === 0 ? <NoIdeaMilestonesInfo idea={idea} /> : null}
                    {canEditIdeaMilestones ? (
                        <CreateMilestoneButton text={t('idea.milestones.createMilestone')} onClick={createModal.open} />
                    ) : null}
                    <IdeaMilestonesList idea={idea} ideaMilestones={ideaMilestones} />
                    <IdeaMilestoneCreateModal open={createModal.visible} idea={idea} onClose={createModal.close} />
                </div>
            ) : null}
        </LoadingWrapper>
    )
}

export default IdeaMilestones
