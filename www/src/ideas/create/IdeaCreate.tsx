import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { RightButton, LeftButton } from '../../components/form/buttons/Buttons'
import Container from '../../components/form/Container'
import config from '../../config'
import { ROUTE_IDEAS } from '../../routes/routes'
import IdeaForm from '../form/IdeaForm'
import { createEmptyIdea, createIdea, IdeaDto, IdeaStatus } from '../ideas.api'
import { ErrorType, useError } from '../../components/error/useError'
import { ErrorMessageModalBox } from '../../components/error/ErrorMessageModalBox'
import { FormFooter } from '../../components/form/footer/FormFooter'

interface Props {
    network: string
}

const IdeaCreate = ({ network = config.NETWORK_NAME }: Props) => {
    const { t } = useTranslation()
    const history = useHistory()
    const [idea] = useState(createEmptyIdea(network))
    const [activate, setActivate] = useState(false)

    const { error, setError } = useError()

    const submit = (formIdea: IdeaDto) => {
        const editedIdea = { ...idea, ...formIdea, status: activate ? IdeaStatus.Active : IdeaStatus.Draft }
        createIdea(editedIdea)
            .then(() => {
                history.push(ROUTE_IDEAS)
            })
            .catch((err: ErrorType) => {
                setError(err)
                throw err
            })
    }

    const doActivate = () => setActivate(true)
    const dontActivate = () => setActivate(false)

    return (
        <Container title={t('idea.introduceTitle')}>
            <IdeaForm idea={idea} onSubmit={submit}>
                <FormFooter>
                    <LeftButton onClick={dontActivate}>{t('idea.details.saveDraft')}</LeftButton>
                    {<ErrorMessageModalBox message={t('errors.somethingWentWrong')} />}
                    <RightButton onClick={doActivate}>{t('idea.details.create')}</RightButton>
                </FormFooter>
            </IdeaForm>
        </Container>
    )
}

export default IdeaCreate
