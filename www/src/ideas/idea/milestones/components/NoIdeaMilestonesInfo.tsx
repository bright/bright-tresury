import React from 'react'
import { useTranslation } from 'react-i18next'

export interface NoIdeaMilestonesInfoProps {
    canEdit: boolean
    displayWithinIdeaSubTab: boolean
}

export const NoIdeaMilestonesInfo = ({ canEdit, displayWithinIdeaSubTab }: NoIdeaMilestonesInfoProps) => {
    const { t } = useTranslation()

    if (canEdit && displayWithinIdeaSubTab) {
        return <p>{t('idea.milestones.noIdeaMilestonesInfoDisplayedWithinIdeaSubTabForPeronWhoCanEdit')}</p>
    }

    if (!canEdit && displayWithinIdeaSubTab) {
        return <p>{t('idea.milestones.noIdeaMilestonesInfoDisplayedWithinIdeaSubTabForPeronWhoCannotEdit')}</p>
    }

    if (canEdit && !displayWithinIdeaSubTab) {
        return <p>{t('idea.milestones.noIdeaMilestonesInfoDisplayedOutsideIdeaSubTabForPersonWhoCanEdit')}</p>
    }

    if (!canEdit && !displayWithinIdeaSubTab) {
        return <p>{t('idea.milestones.noIdeaMilestonesInfoDisplayedOutsideIdeaSubTabForPersonWhoCannotEdit')}</p>
    }

    return <p>{t('idea.milestones.noIdeaMilestonesInfoFallback')}</p>
}
