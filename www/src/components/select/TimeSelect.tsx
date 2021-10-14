import React from 'react'
import Select from './Select'
import { useTranslation } from 'react-i18next'

export const TimeSelect: React.FC = () => {
    const { t } = useTranslation()

    return (
        <Select
            value={t('components.timeSelect.currentSpendTime')}
            options={[t('components.timeSelect.currentSpendTime')]}
        />
    )
}
