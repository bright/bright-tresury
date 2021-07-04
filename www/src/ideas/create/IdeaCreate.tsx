import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormFooterButton from '../../components/form/footer/FormFooterButton'
import Container from '../../components/form/Container'
import { useNetworks } from '../../networks/useNetworks'
import IdeaForm from '../form/IdeaForm'
import { useCreateIdea } from '../ideas.api'
import FormFooterErrorBox from '../../components/form/footer/FormFooterErrorBox'
import { useHistory } from 'react-router'
import { ROUTE_IDEAS } from '../../routes/routes'
import { IdeaDto, IdeaStatus } from '../ideas.dto'
import FormFooterButtonsContainer from '../../components/form/footer/FormFooterButtonsContainer'
import { createEmptyIdea } from '../utils/ideas.utils'

const IdeaCreate = () => {
    const { t } = useTranslation()
    const { network } = useNetworks()

    const [idea] = useState(createEmptyIdea(network.id))
    const [activate, setActivate] = useState(false)

    const history = useHistory()

    const { mutateAsync, isError } = useCreateIdea()

    const submit = async (formIdea: IdeaDto) => {
        const editedIdea = { ...idea, ...formIdea, status: activate ? IdeaStatus.Active : IdeaStatus.Draft }

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
            <IdeaForm idea={idea} onSubmit={submit}>
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
