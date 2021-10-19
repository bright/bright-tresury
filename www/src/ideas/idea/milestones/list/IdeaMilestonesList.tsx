import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '../../../../components/grid/Grid'
import { mobileHeaderListHorizontalMargin } from '../../../../components/header/list/HeaderListContainer'
import { useModal } from '../../../../components/modal/useModal'
import { IdeaDto } from '../../../ideas.dto'
import SubmitProposalModal, { ExtrinsicDetails } from '../../../SubmitProposalModal'
import { useTurnIdeaMilestoneIntoProposal } from '../idea.milestones.api'
import { IdeaMilestoneDto, TurnIdeaMilestoneIntoProposalDto } from '../idea.milestones.dto'
import TurnIdeaMilestoneIntoProposalModal from '../turnIntoProposal/TurnIdeaMilestoneIntoProposalModal'
import IdeaMilestoneCard from './IdeaMilestoneCard'
import IdeaMilestoneModal from './IdeaMilestoneModal'

interface OwnProps {
    idea: IdeaDto
    ideaMilestones: IdeaMilestoneDto[]
}

export type IdeaMilestoneListProps = OwnProps

const IdeaMilestonesList = ({ idea, ideaMilestones }: IdeaMilestoneListProps) => {
    const { t } = useTranslation()

    const [focusedIdeaMilestone, setFocusedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)

    const { mutateAsync } = useTurnIdeaMilestoneIntoProposal()

    const [
        ideaMilestoneToBeTurnedIntoProposal,
        setIdeaMilestoneToBeTurnedIntoProposal,
    ] = useState<IdeaMilestoneDto | null>(null)

    const milestoneModal = useModal()
    const turnModal = useModal()
    const submitProposalModal = useModal()

    const handleOnMilestoneModalClose = () => {
        milestoneModal.close()
        setFocusedIdeaMilestone(null)
    }

    const handleOnCardClick = (ideaMilestone: IdeaMilestoneDto) => {
        milestoneModal.open()
        setFocusedIdeaMilestone(ideaMilestone)
    }

    const handleOnTurnIntoProposalClick = (ideaMilestone: IdeaMilestoneDto) => {
        setIdeaMilestoneToBeTurnedIntoProposal(ideaMilestone)
        turnModal.open()
    }

    const handleOnSuccessfulPatchBeforeTurnIntoProposalSubmit = (patchedIdeaMilestone: IdeaMilestoneDto) => {
        turnModal.close()
        milestoneModal.close()
        setIdeaMilestoneToBeTurnedIntoProposal(patchedIdeaMilestone)
        submitProposalModal.open()
    }

    const onTurn = useCallback(
        async ({ extrinsicHash, lastBlockHash }: ExtrinsicDetails) => {
            if (ideaMilestoneToBeTurnedIntoProposal) {
                const turnIdeaMilestoneIntoProposalDto: TurnIdeaMilestoneIntoProposalDto = {
                    ideaMilestoneNetworkId: ideaMilestoneToBeTurnedIntoProposal.currentNetwork.id,
                    extrinsicHash,
                    lastBlockHash,
                }

                await mutateAsync({
                    ideaId: idea.id,
                    ideaMilestoneId: ideaMilestoneToBeTurnedIntoProposal.id,
                    data: turnIdeaMilestoneIntoProposalDto,
                })
            }
        },
        [idea.id, ideaMilestoneToBeTurnedIntoProposal, mutateAsync],
    )

    const renderIdeaMilestoneCard = (ideaMilestone: IdeaMilestoneDto) => {
        return <IdeaMilestoneCard ideaMilestone={ideaMilestone} onClick={handleOnCardClick} />
    }

    return (
        <>
            <Grid
                items={ideaMilestones}
                renderItem={renderIdeaMilestoneCard}
                horizontalPadding={'0px'}
                mobileHorizontalPadding={mobileHeaderListHorizontalMargin}
            />

            {focusedIdeaMilestone ? (
                <IdeaMilestoneModal
                    open={milestoneModal.visible}
                    idea={idea}
                    ideaMilestone={focusedIdeaMilestone}
                    onClose={handleOnMilestoneModalClose}
                    onTurnIntoProposalClick={handleOnTurnIntoProposalClick}
                />
            ) : null}

            {ideaMilestoneToBeTurnedIntoProposal ? (
                <TurnIdeaMilestoneIntoProposalModal
                    open={turnModal.visible}
                    idea={idea}
                    ideaMilestone={ideaMilestoneToBeTurnedIntoProposal}
                    onClose={turnModal.close}
                    onSuccessfulPatch={handleOnSuccessfulPatchBeforeTurnIntoProposalSubmit}
                />
            ) : null}

            {ideaMilestoneToBeTurnedIntoProposal ? (
                <SubmitProposalModal
                    open={submitProposalModal.visible}
                    onClose={submitProposalModal.close}
                    onTurn={onTurn}
                    title={t('idea.milestones.turnIntoProposal.submit.title')}
                    value={ideaMilestoneToBeTurnedIntoProposal.currentNetwork.value}
                    beneficiary={ideaMilestoneToBeTurnedIntoProposal.beneficiary!}
                />
            ) : null}
        </>
    )
}

export default IdeaMilestonesList
