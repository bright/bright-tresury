import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../components/form/Container'
import FormFooterButton from '../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../components/form/footer/FormFooterButtonsContainer'
import BountyCreateForm from './BountyCreateForm'

const BountyCreate = () => {
    const { t } = useTranslation()

    return (
        <Container title={t('bounty.create.title')}>
            <BountyCreateForm>
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'}>{t('bounty.create.submit')}</FormFooterButton>
                </FormFooterButtonsContainer>
            </BountyCreateForm>
        </Container>
    )
}

export default BountyCreate
