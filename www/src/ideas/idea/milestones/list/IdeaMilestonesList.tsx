import React, { useCallback, useState } from 'react'
import {
    IdeaMilestoneDto,
    turnIdeaMilestoneIntoProposal,
    TurnIdeaMilestoneIntoProposalDto,
} from '../idea.milestones.api'
import { IdeaMilestoneDetailsModal } from '../details/IdeaMilestoneDetailsModal'
import { IdeaDto } from '../../../ideas.api'
import { Grid } from '../../../../components/grid/Grid'
import { IdeaMilestoneCard } from './IdeaMilestoneCard'
import { mobileHeaderListHorizontalMargin } from '../../../../components/header/list/HeaderListContainer'
import { TurnIdeaMilestoneIntoProposalModal } from '../turnIntoProposal/TurnIdeaMilestoneIntoProposalModal'
import { useModal } from '../../../../components/modal/useModal'
import { ExtrinsicDetails, SubmitProposalModal } from '../../../SubmitProposalModal'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { IdeaMilestoneEditModal } from '../edit/IdeaMilestoneEditModal'

interface Props {
    idea: IdeaDto
    ideaMilestones: IdeaMilestoneDto[]
    canEdit: boolean
}

export const IdeaMilestonesList = ({ idea, ideaMilestones, canEdit }: Props) => {
    const { t } = useTranslation()

    const queryClient = useQueryClient()

    const [focusedIdeaMilestone, setFocusedIdeaMilestone] = useState<IdeaMilestoneDto | null>(null)

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

    const handleOnSubmitProposalModalClose = async () => {
        submitProposalModal.close()
        // We fetch idea milestones here because data could be patched before transaction
        // and without fetch user could see outdated data
        await queryClient.refetchQueries(['ideaMilestones', idea.id])
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
        async (extrinsicDetails: ExtrinsicDetails) => {
            if (ideaMilestoneToBeTurnedIntoProposal) {
                const turnIdeaMilestoneIntoProposalDto: TurnIdeaMilestoneIntoProposalDto = {
                    ideaMilestoneNetworkId: ideaMilestoneToBeTurnedIntoProposal.networks[0].id,
                    extrinsicHash: extrinsicDetails.extrinsicHash,
                    lastBlockHash: extrinsicDetails.lastBlockHash,
                }

                await turnIdeaMilestoneIntoProposal(
                    idea.id,
                    ideaMilestoneToBeTurnedIntoProposal.id,
                    turnIdeaMilestoneIntoProposalDto,
                )
            }
        },
        [idea.id, ideaMilestoneToBeTurnedIntoProposal],
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
                    onClose={handleOnSubmitProposalModalClose}
                    onTurn={onTurn}
                    title={t('idea.milestones.turnIntoProposal.submit.title')}
                    value={ideaMilestoneToBeTurnedIntoProposal.networks[0].value}
                    beneficiary={ideaMilestoneToBeTurnedIntoProposal.beneficiary!}
                />
            ) : null}
        </>
    )
}
