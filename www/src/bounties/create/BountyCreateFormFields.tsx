import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../components/form/input/StyledSmallInput'
import { BountyCreateFormValues } from './BountyCreateForm'
import BountyNetworkValueInput from '../form/fields/BountyNetworkValueInput'
import DescriptionField from '../form/fields/DescriptionField'
import FieldOfBountyField from '../form/fields/FieldOfBountyField'
import TitleField from '../form/fields/TitleField'

interface OwnProps {
    formValues: BountyCreateFormValues
}

export type BountyCreateFormFieldsProps = OwnProps

const BountyCreateFormFields = ({ formValues }: BountyCreateFormFieldsProps) => {
    const { t } = useTranslation()

    return (
        <>
            <TitleField />
            <FieldOfBountyField />
            <BountyNetworkValueInput blockchainDescription={formValues.blockchainDescription} />
            <StyledSmallInput
                name="blockchainDescription"
                placeholder={t('bounty.form.fields.blockchainDescription')}
                label={t('bounty.form.fields.blockchainDescription')}
            />
            <DescriptionField />
        </>
    )
}

export default BountyCreateFormFields
