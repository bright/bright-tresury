import React from 'react'
import { useTranslation } from 'react-i18next'
import Status from '../../../../components/status/Status'
import { theme } from '../../../../theme/theme'
import { IdeaMilestoneStatus } from '../idea.milestones.dto'

interface OwnProps {
    status: IdeaMilestoneStatus
}

export type IdeaMilestoneStatusIndicatorProps = OwnProps

const IdeaMilestoneStatusIndicator = ({ status }: IdeaMilestoneStatusIndicatorProps) => {
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

export default IdeaMilestoneStatusIndicator
