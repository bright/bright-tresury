import React from 'react'
import BeneficiaryField from '../../../../form/fields/BeneficiaryField'

interface OwnProps {}

export type BountyFormFieldsProps = OwnProps

const BountyAwardFormFields = ({}: BountyFormFieldsProps) => {
    return <BeneficiaryField />
}

export default BountyAwardFormFields
