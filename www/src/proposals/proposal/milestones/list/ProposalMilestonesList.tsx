import React, { useState } from 'react'
import Grid from '../../../../components/grid/Grid'
import { mobileHeaderListHorizontalMargin } from '../../../../components/header/list/HeaderListContainer'
import Modal from '../../../../components/modal/Modal'
import { useModal } from '../../../../components/modal/useModal'
import ProposalMilestoneDetails from '../details/ProposalMilestoneDetails'
import { ProposalMilestoneDto } from '../proposal.milestones.dto'
import ProposalMilestoneCard from './ProposalMilestoneCard'

interface OwnProps {
    milestones: ProposalMilestoneDto[]
}

export type ProposalMilestonesProps = OwnProps

const ProposalMilestonesList = ({ milestones }: ProposalMilestonesProps) => {
    const [selectedMilestone, setSelectedMilestone] = useState<ProposalMilestoneDto | undefined>()

    const { visible, open, close } = useModal()

    const renderCard = (milestone: ProposalMilestoneDto) => {
        setSelectedMilestone(milestone)
        return <ProposalMilestoneCard milestone={milestone} onClick={open} />
    }

    return (
        <>
            <Grid
                items={milestones}
                renderItem={renderCard}
                horizontalPadding={'0px'}
                mobileHorizontalPadding={mobileHeaderListHorizontalMargin}
            />
            {selectedMilestone ? (
                <Modal open={visible} onClose={close} aria-labelledby="modal-title" fullWidth={true} maxWidth={'md'}>
                    <ProposalMilestoneDetails milestone={selectedMilestone} onCancel={close} />
                </Modal>
            ) : null}
        </>
    )
}

export default ProposalMilestonesList
