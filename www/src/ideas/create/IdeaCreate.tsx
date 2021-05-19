import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormButton } from '../../components/form/footer/buttons/Buttons'
import Container from '../../components/form/Container'
import config from '../../config'
import IdeaForm from '../form/IdeaForm'
import { useCreateIdea } from '../ideas.api'
import { Footer } from '../../components/form/footer/Footer'
import { ErrorBox } from '../../components/form/footer/errorBox/ErrorBox'
import { useHistory } from 'react-router'
import { ROUTE_IDEAS } from '../../routes/routes'
import { createEmptyIdea, IdeaDto, IdeaStatus } from '../ideas.dto'
import { ButtonsContainer } from '../../components/form/footer/buttons/ButtonsContainer'

interface Props {
    network: string
}

export const IdeaCreate = ({ network = config.NETWORK_NAME }: Props) => {
    const { t } = useTranslation()
    const [idea] = useState(createEmptyIdea(network))
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
                <Footer>
                    {isError ? <ErrorBox error={t('errors.somethingWentWrong')} /> : null}
                    <ButtonsContainer>
                        <FormButton onClick={dontActivate} variant={'outlined'} type={'submit'}>
                            {t('idea.details.saveDraft')}
                        </FormButton>

                        <FormButton onClick={doActivate} variant={'contained'} type={'submit'}>
                            {t('idea.details.create')}
                        </FormButton>
                    </ButtonsContainer>

                    {/*<ButtonsContainer>*/}
                    {/*    <RightButton onClick={doActivate}>{t('idea.details.create')}</RightButton>*/}
                    {/*    <LeftButton onClick={dontActivate}>{t('idea.details.saveDraft')}</LeftButton>*/}
                    {/*</ButtonsContainer>*/}
                </Footer>
            </IdeaForm>
        </Container>
    )
}
