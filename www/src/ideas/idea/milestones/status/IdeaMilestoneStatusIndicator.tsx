import React from 'react'
import { useTranslation } from 'react-i18next'
import { Status } from '../../../../components/status/Status'
import { theme } from '../../../../theme/theme'
import { IdeaMilestoneStatus } from '../idea.milestones.dto'

interface Props {
    status: IdeaMilestoneStatus
}

export const IdeaMilestoneStatusIndicator = ({ status }: Props) => {
    const { t } = useTranslation()

    if (status === IdeaMilestoneStatus.TurnedIntoProposal) {
        return (
            <Status
                label={t('idea.list.card.statusTurnedIntoProposal')}
                color={theme.palette.status.turnedIntoProposal}
            />
        )
    }

    return null
}
