import React from 'react'
import TitleField from 'tips/form/fields/TitleField'
import BeneficiaryField from '../../form/fields/BeneficiaryField'
import BlockchainReasonField from '../../form/fields/BlockchainReasonField'
import DescriptionField from '../../form/fields/DescriptionField'
import ValueField from '../../form/fields/ValueField'

interface OwnProps {}

export type TipCreateAndTipFormFieldsProps = OwnProps

const TipCreateAndTipFormFields = ({}: TipCreateAndTipFormFieldsProps) => {
    return (
        <>
            <TitleField />
            <BeneficiaryField />
            <BlockchainReasonField />
            <ValueField />
            <DescriptionField />
        </>
    )
}

export default TipCreateAndTipFormFields
