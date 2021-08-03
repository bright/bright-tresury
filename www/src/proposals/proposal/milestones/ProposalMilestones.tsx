import React from 'react'
import { useTranslation } from 'react-i18next'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import { useNetworks } from '../../../networks/useNetworks'
import NoProposalMilestonesInfo from './list/NoProposalMilestonesInfo'
import ProposalMilestonesList from './list/ProposalMilestonesList'
import { useGetProposalMilestones } from './proposal.milestones.api'

interface OwnProps {
    proposalIndex: number
    canEdit: boolean
}

export type ProposalMilestonesProps = OwnProps

const ProposalMilestones = ({ proposalIndex, canEdit }: ProposalMilestonesProps) => {
    const classes = useSuccessfullyLoadedItemStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { status, data: milestones } = useGetProposalMilestones({ proposalIndex, network: network.id })

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingProposalMilestones')}
            loadingText={t('loading.proposalMilestones')}
        >
            {milestones ? (
                <div className={classes.content}>
                    {milestones.length === 0 ? <NoProposalMilestonesInfo canEdit={canEdit} /> : null}
                    <ProposalMilestonesList milestones={milestones} />
                </div>
            ) : null}
        </LoadingWrapper>
    )
}

export default ProposalMilestones
