import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChildBountyStatus } from '../child-bounties.dto'
import Status from '../../../../components/status/Status'

interface OwnProps {
    status: ChildBountyStatus
}

export type BountyStatusIndicatorProps = OwnProps

const ChildBountyStatusIndicator = ({ status }: BountyStatusIndicatorProps) => {
    const { t } = useTranslation()

    const getStatusTranslationKey = (): string => {
        switch (status) {
            case ChildBountyStatus.Added:
                return 'Added'
            case ChildBountyStatus.CuratorProposed:
                return 'Curator Proposed'
            case ChildBountyStatus.Active:
                return 'Active'
            case ChildBountyStatus.PendingPayout:
                return 'Pending Payout'
            case ChildBountyStatus.Awarded:
                return 'Awarded'
            case ChildBountyStatus.Claimed:
                return 'Claimed'
            case ChildBountyStatus.Canceled:
                return 'Canceled'
            case ChildBountyStatus.Unknown:
                return 'Unknown'
        }
    }

    const getStatusColor = (): string => {
        switch (status) {
            case ChildBountyStatus.Added:
                return '#3091D8'
            case ChildBountyStatus.CuratorProposed:
                return '#F26763'
            case ChildBountyStatus.Active:
                return '#0E65F2'
            case ChildBountyStatus.PendingPayout:
                return '#01D55A'
            case ChildBountyStatus.Awarded:
                return '#01D55A'
            case ChildBountyStatus.Claimed:
                return '#01D55A'
            case ChildBountyStatus.Canceled:
                return '#999'
            case ChildBountyStatus.Unknown:
                return '#999'
        }
    }

    return <Status label={t(getStatusTranslationKey())} color={getStatusColor()} />
}

export default ChildBountyStatusIndicator
