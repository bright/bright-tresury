import React from 'react'
import TitleField from 'tips/form/fields/TitleField'
import BeneficiaryField from '../../form/fields/BeneficiaryField'
import BlockchainReasonField from '../../form/fields/BlockchainReasonField'
import DescriptionField from '../../form/fields/DescriptionField'
import TipBond from '../../form/fields/TipBond'
import { TipCreateFormValues } from '../useTipCreate'

interface OwnProps {
    values: TipCreateFormValues
}

export type TipCreateOnlyFormFieldsProps = OwnProps

const TipCreateOnlyFormFields = ({ values }: TipCreateOnlyFormFieldsProps) => {
    return (
        <>
            <TitleField />
            <BeneficiaryField />
            <BlockchainReasonField />
            <TipBond blockchainReason={values.blockchainReason} />
            <DescriptionField />
        </>
    )
}

export default TipCreateOnlyFormFields
