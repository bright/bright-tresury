import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../../components/form/input/StyledSmallInput'
import { BountyDto, BountyStatus } from '../../bounties.dto'
import DescriptionField from '../../form/fields/DescriptionField'
import FieldOfBountyField from '../../form/fields/FieldOfBountyField'
import TitleField from '../../form/fields/TitleField'

interface OwnProps {
    bounty: BountyDto
}

export type BountyFormFieldsProps = OwnProps

const BountyEditFormFields = ({ bounty }: BountyFormFieldsProps) => {
    const { t } = useTranslation()

    return (
        <>
            <TitleField />
            {bounty.status === BountyStatus.Active ? (
                <StyledSmallInput
                    name="beneficiary"
                    placeholder={t('bounty.form.fields.beneficiary')}
                    label={t('bounty.form.fields.beneficiary')}
                />
            ) : null}
            <FieldOfBountyField />
            <DescriptionField />
        </>
    )
}

export default BountyEditFormFields
