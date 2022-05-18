import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../../../components/form/input/StyledSmallInput'
import { ChildBountyCreateFormValues } from './ChildBountyCreateForm'
import BountyNetworkValueInput from '../../../form/fields/BountyNetworkValueInput'
import DescriptionField from '../../../form/fields/DescriptionField'
import FieldOfBountyField from '../../../form/fields/FieldOfBountyField'
import TitleField from '../../../form/fields/TitleField'

interface OwnProps {
    formValues: ChildBountyCreateFormValues
}

export type ChildBountyCreateFormFieldsProps = OwnProps

const ChildBountyCreateFormFields = ({ formValues }: ChildBountyCreateFormFieldsProps) => {
    const { t } = useTranslation()

    return (
        <>
            <TitleField />
            <BountyNetworkValueInput blockchainDescription={formValues.blockchainDescription} />
            <StyledSmallInput
                name="blockchainDescription"
                placeholder={t('childBounty.form.fields.blockchainDescription')}
                label={t('childBounty.form.fields.blockchainDescription')}
            />
            <DescriptionField />
        </>
    )
}

export default ChildBountyCreateFormFields
