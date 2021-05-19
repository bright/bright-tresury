import React from 'react'
import { useTranslation } from 'react-i18next'
import { Status } from '../../../components/status/Status'
import { theme } from '../../../theme/theme'
import { IdeaStatus } from '../../ideas.dto'

interface Props {
    status: IdeaStatus
}

export const IdeaStatusIndicator = ({ status }: Props) => {
    const { t } = useTranslation()

    const getStatusTranslationKey = (): string => {
        switch (status) {
            case IdeaStatus.Draft:
                return 'idea.list.card.statusDraft'
            case IdeaStatus.Active:
                return 'idea.list.card.statusActive'
            case IdeaStatus.TurnedIntoProposal:
                return 'idea.list.card.statusTurnedIntoProposal'
            case IdeaStatus.TurnedIntoProposalByMilestone:
                return 'idea.list.card.statusTurnedIntoProposalByMilestone'
            case IdeaStatus.Closed:
                return 'idea.list.card.statusClosed'
        }
    }

    const getStatusColor = (): string => {
        switch (status) {
            case IdeaStatus.Draft:
                return theme.palette.status.draft
            case IdeaStatus.Active:
                return theme.palette.status.active
            case IdeaStatus.TurnedIntoProposal:
                return theme.palette.status.turnedIntoProposal
            case IdeaStatus.TurnedIntoProposalByMilestone:
                return theme.palette.status.turnedIntoProposalByMilestone
            case IdeaStatus.Closed:
                return theme.palette.status.closed
        }
    }

    return <Status label={t(getStatusTranslationKey())} color={getStatusColor()} />
}
