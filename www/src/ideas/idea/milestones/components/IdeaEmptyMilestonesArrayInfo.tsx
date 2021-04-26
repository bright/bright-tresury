import React from 'react'
import {useTranslation} from "react-i18next";

export const EmptyIdeaMilestonesArrayInfo = () => {
    const { t } = useTranslation()
    return <p>{t('idea.milestones.emptyMilestonesArrayInfo')}</p>
}