import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProposalStatus } from '../proposals.dto'
import Status from '../../components/status/Status'

interface OwnProps {
    status: ProposalStatus
}

export type ProposalStatusIndicatorProps = OwnProps

const ProposalStatusIndicator = ({ status }: ProposalStatusIndicatorProps) => {
    const { t } = useTranslation()

    const getStatusTranslationKey = (): string => {
        switch (status) {
            case ProposalStatus.Submitted:
                return 'proposal.list.card.statusSubmitted'
            case ProposalStatus.Approved:
                return 'proposal.list.card.statusApproved'
            case ProposalStatus.Closed:
                return 'proposal.list.card.statusClosed'
            case ProposalStatus.Rejected:
                return 'proposal.list.card.statusRejected'
            case ProposalStatus.Rewarded:
                return 'proposal.list.card.statusRewarded'
        }
    }

    const getStatusColor = (): string => {
        switch (status) {
            case ProposalStatus.Submitted:
                return '#3091D8'
            case ProposalStatus.Approved:
                return '#2FD3AE'
            case ProposalStatus.Closed:
                return '#1B1D1C'
            case ProposalStatus.Rejected:
                return '#1B1D1C'
            case ProposalStatus.Rewarded:
                return '#2FD3AE'
        }
    }

    return <Status label={t(getStatusTranslationKey())} color={getStatusColor()} />
}

export default ProposalStatusIndicator
