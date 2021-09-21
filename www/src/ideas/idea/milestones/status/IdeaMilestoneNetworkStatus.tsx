import React from 'react'
import Status from '../../../../components/status/Status'
import { theme } from '../../../../theme/theme'
import { IdeaMilestoneNetworkStatus } from '../idea.milestones.dto'
import { useTranslation } from 'react-i18next'
import { ClassNameProps } from '../../../../components/props/className.props'

interface OwnProps {
    status: IdeaMilestoneNetworkStatus
    sublabel?: string
}

export type IdeaMilestoneNetworkStatusIndicatorProps = OwnProps & ClassNameProps

const IdeaMilestoneNetworkStatusIndicator = ({
    status,
    className,
    sublabel,
}: IdeaMilestoneNetworkStatusIndicatorProps) => {
    const { t } = useTranslation()

    if (!status || status === IdeaMilestoneNetworkStatus.Active) return null

    const label = t(
        status === IdeaMilestoneNetworkStatus.Pending
            ? 'idea.list.card.pending'
            : 'idea.list.card.statusTurnedIntoProposal',
    )
    const color =
        status === IdeaMilestoneNetworkStatus.Pending
            ? theme.palette.status.pending
            : theme.palette.status.turnedIntoProposal

    return <Status label={label} color={color} className={className} sublabel={sublabel} />
}

export default IdeaMilestoneNetworkStatusIndicator
