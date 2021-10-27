import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledInput from '../../components/form/input/StyledInput'
import StyledSmallInput from '../../components/form/input/StyledSmallInput'
import StyledSmallFormSelect from '../../components/select/StyledSmallFormSelect'
import NetworkInput from '../../ideas/form/networks/NetworkInput'

const BountyFormFields = () => {
    const { t } = useTranslation()

    return (
        <>
            <StyledInput
                name="title"
                placeholder={t('bounty.form.fields.title')}
                label={t('bounty.form.fields.title')}
            />
            <StyledSmallFormSelect
                name="field"
                label={t('bounty.form.fields.field')}
                placeholder={t('bounty.form.fields.field')}
                options={[
                    t('bounty.form.fields.fieldOptions.optimisation'),
                    t('bounty.form.fields.fieldOptions.treasury'),
                    t('bounty.form.fields.fieldOptions.transactions'),
                    t('bounty.form.fields.fieldOptions.other'),
                ]}
            />
            {/*TODO TREAS-244 create a separate component to show the bond deposit value*/}
            <NetworkInput inputName={'value'} value={0} />
            <StyledSmallInput
                name="blockchainDescription"
                placeholder={t('bounty.form.fields.blockchainDescription')}
                label={t('bounty.form.fields.blockchainDescription')}
            />
            <StyledInput
                name="description"
                multiline={true}
                rows={8}
                label={t('bounty.form.fields.description')}
                placeholder={t('bounty.form.fields.description')}
            />
        </>
    )
}

export default BountyFormFields
