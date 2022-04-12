import React from 'react'
import TitleField from 'tips/form/fields/TitleField'
import BeneficiaryField from '../form/fields/BeneficiaryField'
import BlockchainDescriptionField from '../form/fields/BlockchainDescriptionField'
import DescriptionField from '../form/fields/DescriptionField'
import TipBond from '../form/fields/TipBond'
import { TipCreateFormValues } from './useTipCreate'

interface OwnProps {
    values: TipCreateFormValues
}

export type TipCreateFormFieldsProps = OwnProps

const TipCreateFormFields = ({ values }: TipCreateFormFieldsProps) => {
    return (
        <>
            <TitleField />
            <BeneficiaryField />
            <TipBond blockchainDescription={values.blockchainDescription} />
            <BlockchainDescriptionField />
            <DescriptionField />
        </>
    )
}

export default TipCreateFormFields
