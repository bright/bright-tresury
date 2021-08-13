import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import Container from '../../components/form/Container'
import FormFooterButton from '../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../components/form/footer/FormFooterErrorBox'
import { useNetworks } from '../../networks/useNetworks'
import { ROUTE_IDEAS } from '../../routes/routes'
import IdeaForm from '../form/IdeaForm'
import { useCreateIdea } from '../ideas.api'
import { EditIdeaDto, IdeaStatus } from '../ideas.dto'

const IdeaCreate = () => {
    const { t } = useTranslation()

    const [activate, setActivate] = useState(false)

    const history = useHistory()

    const { mutateAsync, isError } = useCreateIdea()

    const submit = async (formIdea: EditIdeaDto) => {
        const editedIdea = { ...formIdea, status: activate ? IdeaStatus.Active : IdeaStatus.Draft }

        await mutateAsync(editedIdea, {
            onSuccess: () => {
                history.push(ROUTE_IDEAS)
            },
        })
    }

    const doActivate = () => setActivate(true)
    const dontActivate = () => setActivate(false)

    return (
        <Container title={t('idea.introduceTitle')}>
            <IdeaForm onSubmit={submit}>
                {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}

                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'} variant={'contained'} onClick={doActivate}>
                        {t('idea.details.create')}
                    </FormFooterButton>

                    <FormFooterButton type={'submit'} variant={'outlined'} onClick={dontActivate}>
                        {t('idea.details.saveDraft')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            </IdeaForm>
        </Container>
    )
}

export default IdeaCreate
