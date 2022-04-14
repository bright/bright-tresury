import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../components/form/Container'
import FormFooterButton from '../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../components/form/footer/FormFooterButtonsContainer'
import TipCreateForm from './TipCreateForm'
import TipCreateHeader from './TipCreateHeader'
import { TipCreateMode } from './TipCreateSwitch'

const TipCreate = () => {
    const { t } = useTranslation()
    const [mode, setMode] = useState<TipCreateMode>('createOnly')

    return (
        <Container title={t('tip.create.title')} showWarningOnClose={true}>
            <TipCreateHeader mode={mode} setMode={setMode} />
            <TipCreateForm mode={mode}>
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'}>{t('tip.create.create')}</FormFooterButton>
                </FormFooterButtonsContainer>
            </TipCreateForm>
        </Container>
    )
}

export default TipCreate
