import React, { useMemo, useState } from 'react'
import Grid from '../../../../components/grid/Grid'
import { mobileHeaderListHorizontalMargin } from '../../../../components/header/list/HeaderListContainer'
import Modal from '../../../../components/modal/Modal'
import { useModal } from '../../../../components/modal/useModal'
import { compareMilestoneDetails } from '../../../../milestone-details/utils'
import ProposalMilestoneDetails from '../details/ProposalMilestoneDetails'
import { ProposalMilestoneDto } from '../proposal.milestones.dto'
import ProposalMilestoneCard from './ProposalMilestoneCard'

interface OwnProps {
    proposalIndex: number
    milestones: ProposalMilestoneDto[]
    canEdit: boolean
}

export type ProposalMilestonesProps = OwnProps

const ProposalMilestonesList = ({ milestones, canEdit, proposalIndex }: ProposalMilestonesProps) => {
    const [selectedMilestone, setSelectedMilestone] = useState<ProposalMilestoneDto | undefined>()
    const { visible, open, close } = useModal()

    const sortedMilestones = useMemo(() => {
        return [...milestones].sort((a, b) => compareMilestoneDetails(a.details, b.details))
    }, [milestones])

    const renderCard = (milestone: ProposalMilestoneDto, index: number) => {
        const onClick = () => {
            setSelectedMilestone(milestone)
            open()
        }
        return <ProposalMilestoneCard milestone={milestone} onClick={onClick} ordinalNumber={index + 1} />
    }

    return (
        <>
            <Grid
                items={sortedMilestones}
                renderItem={renderCard}
                horizontalPadding={'0px'}
                mobileHorizontalPadding={mobileHeaderListHorizontalMargin}
            />
            {selectedMilestone ? (
                <Modal open={visible} onClose={close} aria-labelledby="modal-title" fullWidth={true} maxWidth={'md'}>
                    <ProposalMilestoneDetails
                        ordinalNumber={sortedMilestones.indexOf(selectedMilestone) + 1}
                        canEdit={canEdit}
                        milestone={selectedMilestone}
                        onClose={close}
                        proposalIndex={proposalIndex}
                    />
                </Modal>
            ) : null}
        </>
    )
}

export default ProposalMilestonesList
