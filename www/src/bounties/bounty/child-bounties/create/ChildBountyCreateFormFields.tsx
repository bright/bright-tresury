import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../../../components/form/input/StyledSmallInput'
import DescriptionField from '../../../form/fields/DescriptionField'
import TitleField from '../../../form/fields/TitleField'
import ChildBountyNetworkValueInput from './ChildBountyNetworkValueInput'

interface OwnProps {}

export type ChildBountyCreateFormFieldsProps = OwnProps

const ChildBountyCreateFormFields = () => {
    const { t } = useTranslation()

    return (
        <>
            <TitleField />
            <ChildBountyNetworkValueInput />
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
