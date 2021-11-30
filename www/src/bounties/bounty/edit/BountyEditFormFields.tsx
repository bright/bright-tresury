import React from 'react'
import { BountyDto, BountyStatus } from '../../bounties.dto'
import BeneficiaryField from '../../form/fields/BeneficiaryField'
import DescriptionField from '../../form/fields/DescriptionField'
import FieldOfBountyField from '../../form/fields/FieldOfBountyField'
import TitleField from '../../form/fields/TitleField'

interface OwnProps {
    bounty: BountyDto
}

export type BountyFormFieldsProps = OwnProps

const BountyEditFormFields = ({ bounty }: BountyFormFieldsProps) => {
    return (
        <>
            <TitleField />
            {bounty.status === BountyStatus.Active ? <BeneficiaryField /> : null}
            <FieldOfBountyField />
            <DescriptionField />
        </>
    )
}

export default BountyEditFormFields
