import React from "react";
import {IdeaStatus} from "../../ideas.api";
import {useTranslation} from "react-i18next";
import {Status} from "../../../components/status/Status";

interface Props {
    ideaStatus: IdeaStatus
}

export const IdeaStatusIndicator: React.FC<Props> = ({ideaStatus}) => {
    const {t} = useTranslation()

    const getStatusTranslationKey = (): string => {
        switch (ideaStatus) {
            case IdeaStatus.Draft:
                return 'idea.list.card.statusDraft'
            case IdeaStatus.Active:
                return 'idea.list.card.statusActive'
            case IdeaStatus.TurnedIntoProposal:
                return 'idea.list.card.statusTurnedIntoProposal'
            case IdeaStatus.Closed:
                return 'idea.list.card.statusClosed'
        }
    }

    const getStatusColor = (): string => {
        switch (ideaStatus) {
            case IdeaStatus.Draft:
                return '#B159A9'
            case IdeaStatus.Active:
                return '#0E65F2'
            case IdeaStatus.TurnedIntoProposal:
                return '#2FD3AE'
            case IdeaStatus.Closed:
                return '#1B1D1C'
        }
    }

    return <Status label={t(getStatusTranslationKey())} color={getStatusColor()}/>
}
