import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../../components/form/Container'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'
import ChildBountyCreateForm from './ChildBountyCreateForm'
import { BountyDto } from '../../../bounties.dto'

interface OwnProps {
    bounty: BountyDto
}

export type ChildBountyCreateProps = OwnProps
const ChildBountyCreate = ({ bounty }: ChildBountyCreateProps) => {
    const { t } = useTranslation()

    return (
        <Container title={t('childBounty.create.title')} showWarningOnClose={true}>
            <ChildBountyCreateForm bounty={bounty}>
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'}>{t('childBounty.create.submit')}</FormFooterButton>
                </FormFooterButtonsContainer>
            </ChildBountyCreateForm>
        </Container>
    )
}

export default ChildBountyCreate
