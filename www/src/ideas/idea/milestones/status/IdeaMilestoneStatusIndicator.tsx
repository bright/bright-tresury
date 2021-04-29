import React from "react";
import {useTranslation} from "react-i18next";
import {IdeaMilestoneStatus} from "../idea.milestones.api";
import {Status} from "../../../../components/status/Status";
import {theme} from "../../../../theme/theme";

interface Props {
    status: IdeaMilestoneStatus
}

export const IdeaMilestoneStatusIndicator = ({ status }: Props) => {

    const { t } = useTranslation()

    if (status === IdeaMilestoneStatus.TurnedIntoProposal) {
        return (
            <Status label={t('idea.list.card.statusTurnedIntoProposal')} color={theme.palette.status.turnedIntoProposal} />
        )
    }

    return null
}
