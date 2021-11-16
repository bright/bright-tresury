import React from 'react'
import { useTranslation } from 'react-i18next'
import Status from '../../components/status/Status'
import { BountyStatus } from '../bounties.dto'

interface OwnProps {
    status: BountyStatus
}

export type BountyStatusIndicatorProps = OwnProps

const BountyStatusIndicator = ({ status }: BountyStatusIndicatorProps) => {
    const { t } = useTranslation()

    const getStatusTranslationKey = (): string => {
        switch (status) {
            case BountyStatus.Proposed:
                return 'bounty.status.proposed'
            case BountyStatus.Approved:
                return 'bounty.status.approved'
            case BountyStatus.Funded:
                return 'bounty.status.funded'
            case BountyStatus.CuratorProposed:
                return 'bounty.status.curatorProposed'
            case BountyStatus.Active:
                return 'bounty.status.active'
            case BountyStatus.PendingPayout:
                return 'bounty.status.pendingPayout'
        }
    }

    const getStatusColor = (): string => {
        switch (status) {
            case BountyStatus.Proposed:
                return '#3091D8'
            case BountyStatus.Approved:
                return '#0E65F2'
            case BountyStatus.Funded:
                return '#2FD3AE'
            case BountyStatus.CuratorProposed:
                return '#F26763'
            case BountyStatus.Active:
                return '#0E65F2'
            case BountyStatus.PendingPayout:
                return '#01D55A'
        }
    }

    return <Status label={t(getStatusTranslationKey())} color={getStatusColor()} />
}

export default BountyStatusIndicator
