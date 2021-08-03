import React from 'react'
import { useTranslation } from 'react-i18next'

interface OwnProps {
    canEdit: boolean
}

export type NoProposalMilestonesInfoProps = OwnProps

const NoProposalMilestonesInfo = ({ canEdit }: NoProposalMilestonesInfoProps) => {
    const { t } = useTranslation()

    if (canEdit) {
        return <p>{t('proposal.milestones.noMilestones.canEdit')}</p>
    } else {
        return <p>{t('proposal.milestones.noMilestones.cannotEdit')}</p>
    }
}

export default NoProposalMilestonesInfo
