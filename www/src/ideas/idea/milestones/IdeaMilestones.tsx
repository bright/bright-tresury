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
import { useNetworks } from '../../../networks/useNetworks'
import WarningModal from '../../../components/modal/WarningModal'

interface OwnProps {
    idea: IdeaDto
}

export type IdeaMilestonesProps = OwnProps

const IdeaMilestones = ({ idea }: IdeaMilestonesProps) => {
    const { t } = useTranslation()

    const classes = useSuccessfullyLoadedItemStyles()

    const createModal = useModal()
    const { network: currentNetwork } = useNetworks()
    const { status, data: ideaMilestones } = useGetIdeaMilestones(idea.id, currentNetwork.id)
    const warningModal = useModal()

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
            <WarningModal open={warningModal.visible} onClose={warningModal.close} />
        </LoadingWrapper>
    )
}

export default IdeaMilestones
