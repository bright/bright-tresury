import React from 'react'
import { useTranslation } from 'react-i18next'

interface OwnProps {
    canEdit: boolean
}

export type NoIdeaMilestonesInfoProps = OwnProps

const NoIdeaMilestonesInfo = ({ canEdit }: NoIdeaMilestonesInfoProps) => {
    const { t } = useTranslation()

    if (canEdit) {
        return <p>{t('idea.milestones.noIdeaMilestones.canEdit')}</p>
    } else {
        return <p>{t('idea.milestones.noIdeaMilestones.cannotEdit')}</p>
    }
}

export default NoIdeaMilestonesInfo
