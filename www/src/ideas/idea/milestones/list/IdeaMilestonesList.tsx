import React, { useCallback, useState } from 'react'
import { useTurnIdeaMilestoneIntoProposal } from '../idea.milestones.api'
import { IdeaMilestoneDetailsModal } from '../details/IdeaMilestoneDetailsModal'
import Grid from '../../../../components/grid/Grid'
import IdeaMilestoneCard from './IdeaMilestoneCard'
import { mobileHeaderListHorizontalMargin } from '../../../../components/header/list/HeaderListContainer'
import TurnIdeaMilestoneIntoProposalModal from '../turnIntoProposal/TurnIdeaMilestoneIntoProposalModal'
import { useModal } from '../../../../components/modal/useModal'
import SubmitProposalModal, { ExtrinsicDetails } from '../../../SubmitProposalModal'
import { useTranslation } from 'react-i18next'
import IdeaMilestoneEditModal from '../edit/IdeaMilestoneEditModal'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDto, TurnIdeaMilestoneIntoProposalDto } from '../idea.milestones.dto'

interface OwnProps {
    idea: IdeaDto
    ideaMilestones: IdeaMilestoneDto[]
    canEdit: boolean
}

export type IdeaMilestoneListProps = OwnProps

const IdeaMilestonesList = ({ idea, ideaMilestones, canEdit }: IdeaMilestoneListProps) => {
    const { t } = useTranslation()

    const [focusedIdeaMilestone, setFocusedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)

    const { mutateAsync } = useTurnIdeaMilestoneIntoProposal()

    const [
        ideaMilestoneToBeTurnedIntoProposal,
        setIdeaMilestoneToBeTurnedIntoProposal,
    ] = useState<IdeaMilestoneDto | null>(null)

    const editModal = useModal()
    const detailsModal = useModal()
    const turnModal = useModal()
    const submitProposalModal = useModal()

    const handleOnEditModalClose = () => {
        editModal.close()
        setFocusedIdeaMilestone(null)
    }

    const handleOnDetailsModalClose = () => {
        detailsModal.close()
        setFocusedIdeaMilestone(null)
    }

    const handleOnCardClick = (ideaMilestone: IdeaMilestoneDto) => {
        if (canEdit) {
            editModal.open()
        } else {
            detailsModal.open()
        }
        setFocusedIdeaMilestone(ideaMilestone)
    }

    const handleOnTurnIntoProposalClick = (ideaMilestone: IdeaMilestoneDto) => {
        setIdeaMilestoneToBeTurnedIntoProposal(ideaMilestone)
        turnModal.open()
    }

    const handleOnSuccessfulPatchBeforeTurnIntoProposalSubmit = (patchedIdeaMilestone: IdeaMilestoneDto) => {
        turnModal.close()
        editModal.close()
        setIdeaMilestoneToBeTurnedIntoProposal(patchedIdeaMilestone)
        submitProposalModal.open()
    }

    const onTurn = useCallback(
        async ({ extrinsicHash, lastBlockHash }: ExtrinsicDetails) => {
            if (ideaMilestoneToBeTurnedIntoProposal) {
                const turnIdeaMilestoneIntoProposalDto: TurnIdeaMilestoneIntoProposalDto = {
                    ideaMilestoneNetworkId: ideaMilestoneToBeTurnedIntoProposal.networks[0].id,
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
                <IdeaMilestoneEditModal
                    open={editModal.visible}
                    idea={idea}
                    ideaMilestone={focusedIdeaMilestone}
                    onClose={handleOnEditModalClose}
                    onTurnIntoProposalClick={handleOnTurnIntoProposalClick}
                />
            ) : null}

            {focusedIdeaMilestone ? (
                <IdeaMilestoneDetailsModal
                    open={detailsModal.visible}
                    idea={idea}
                    ideaMilestone={focusedIdeaMilestone}
                    onClose={handleOnDetailsModalClose}
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
                    value={ideaMilestoneToBeTurnedIntoProposal.networks[0].value}
                    beneficiary={ideaMilestoneToBeTurnedIntoProposal.beneficiary!}
                />
            ) : null}
        </>
    )
}

export default IdeaMilestonesList
