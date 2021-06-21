import React from 'react'
import { useTranslation } from 'react-i18next'

interface OwnProps {
    canEdit: boolean
    displayWithinIdeaSubTab: boolean
}

export type NoIdeaMilestonesInfoProps = OwnProps

const NoIdeaMilestonesInfo = ({ canEdit, displayWithinIdeaSubTab }: NoIdeaMilestonesInfoProps) => {
    const { t } = useTranslation()

    if (canEdit && displayWithinIdeaSubTab) {
        return <p>{t('idea.milestones.noIdeaMilestones.withinIdeaSubTab.canEdit')}</p>
    }

    if (!canEdit && displayWithinIdeaSubTab) {
        return <p>{t('idea.milestones.noIdeaMilestones.withinIdeaSubTab.cannotEdit')}</p>
    }

    if (canEdit && !displayWithinIdeaSubTab) {
        return <p>{t('idea.milestones.noIdeaMilestones.outsideIdeaSubTab.canEdit')}</p>
    }

    return <p>{t('idea.milestones.noIdeaMilestones.outsideIdeaSubTab.cannotEdit')}</p>
}

export default NoIdeaMilestonesInfo
