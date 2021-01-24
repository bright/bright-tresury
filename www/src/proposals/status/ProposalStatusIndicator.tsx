import React from "react";
import {useTranslation} from "react-i18next";
import {ProposalStatus} from "../proposals.api";
import {Status} from "../../components/status/Status";

interface Props {
    proposalStatus: ProposalStatus
}

export const ProposalStatusIndicator: React.FC<Props> = ({proposalStatus}) => {
    const {t} = useTranslation()

    const getStatusTranslationKey = (): string => {
        switch (proposalStatus) {
            case ProposalStatus.Submitted:
                return 'proposal.list.card.statusSubmitted'
            case ProposalStatus.Approved:
                return 'proposal.list.card.statusApproved'
            case ProposalStatus.Closed:
                return 'proposal.list.card.statusClosed'
        }
    }

    const getStatusColor = (): string => {
        switch (proposalStatus) {
            case ProposalStatus.Submitted:
                return '#3091D8'
            case ProposalStatus.Approved:
                return '#2FD3AE'
            case ProposalStatus.Closed:
                return '#1B1D1C'
        }
    }

    return <Status label={t(getStatusTranslationKey())} color={getStatusColor()}/>
}
