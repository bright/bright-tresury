import React from 'react'
import { useTranslation } from 'react-i18next'
import TitleField from 'tips/form/fields/TitleField'
import BeneficiaryField from '../form/fields/BeneficiaryField'
import BlockchainDescriptionField from '../form/fields/BlockchainDescriptionField'
import DescriptionField from '../form/fields/DescriptionField'

interface OwnProps {}

export type TipCreateFormFieldsProps = OwnProps

const TipCreateFormFields = ({}: TipCreateFormFieldsProps) => {
    return (
        <>
            <TitleField />
            <BlockchainDescriptionField />
            <BeneficiaryField />
            <DescriptionField />
        </>
    )
}

export default TipCreateFormFields
