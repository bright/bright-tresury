import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../components/form/Container'
import FormFooterButton from '../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../components/form/footer/FormFooterButtonsContainer'
import TipCreateForm from './TipCreateForm'

const TipCreate = () => {
    const { t } = useTranslation()

    return (
        <Container title={t('tip.create.title')} showWarningOnClose={true}>
            <TipCreateForm>
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'}>{t('tip.create.create')}</FormFooterButton>
                </FormFooterButtonsContainer>
            </TipCreateForm>
        </Container>
    )
}

export default TipCreate
