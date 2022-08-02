import React from 'react'
import { useTranslation } from 'react-i18next'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import Modal from '../../../components/modal/Modal'
import { useModal } from '../../../components/modal/useModal'
import CreateMilestoneButton from '../../../milestone-details/components/CreateMilestoneButton'
import { useNetworks } from '../../../networks/useNetworks'
import { ProposalDto } from '../../proposals.dto'
import ProposalMilestoneCreate from './create/ProposalMilestoneCreate'
import NoProposalMilestonesInfo from './list/NoProposalMilestonesInfo'
import ProposalMilestonesList from './list/ProposalMilestonesList'
import { useGetProposalMilestones } from './proposal.milestones.api'
import { isProposalMadeByUser } from '../../list/filterProposals'
import { useAuth } from '../../../auth/AuthContext'

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalMilestonesProps = OwnProps

const ProposalMilestones = ({ proposal }: ProposalMilestonesProps) => {
    const classes = useSuccessfullyLoadedItemStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { status, data: milestones } = useGetProposalMilestones({
        proposalIndex: proposal.proposalIndex,
        network: network.id,
    })
    const { visible, open, close } = useModal()

    const { user } = useAuth()

    const canEdit = proposal ? isProposalMadeByUser(proposal, user) : false

    return (
        <LoadingWrapper
            list
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingProposalMilestones')}
            loadingText={t('loading.proposalMilestones')}
        >
            <div className={classes.content}>
                {canEdit ? (
                    <>
                        <CreateMilestoneButton text={t('idea.milestones.createMilestone')} onClick={open} />
                        <Modal
                            open={visible}
                            onClose={close}
                            aria-labelledby="modal-title"
                            fullWidth={true}
                            maxWidth={'md'}
                        >
                            <ProposalMilestoneCreate onClose={close} proposalIndex={proposal.proposalIndex} />
                        </Modal>
                    </>
                ) : null}
                {milestones && milestones.length > 0 ? (
                    <ProposalMilestonesList
                        milestones={milestones}
                        canEdit={canEdit}
                        proposalIndex={proposal.proposalIndex}
                    />
                ) : (
                    <NoProposalMilestonesInfo proposal={proposal} />
                )}
            </div>
        </LoadingWrapper>
    )
}

export default ProposalMilestones
