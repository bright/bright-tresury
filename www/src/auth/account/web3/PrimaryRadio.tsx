import { useTranslation } from 'react-i18next'
import React from 'react'
import { FormControlLabel } from '@material-ui/core'
import { Radio } from '../../../components/radio/Radio'

export const PrimaryRadio: React.FC = () => {
    const { t } = useTranslation()
    return (
        <FormControlLabel value="isPrimary" name="isPrimary" control={<Radio />} label={t('account.web3.isPrimary')} />
    )
}
