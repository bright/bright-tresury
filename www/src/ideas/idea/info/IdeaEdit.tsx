import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { generatePath } from 'react-router-dom'
import Container from '../../../components/form/Container'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../components/form/footer/FormFooterErrorBox'
import { ROUTE_IDEA } from '../../../routes/routes'
import IdeaForm from '../../form/IdeaForm'
import { usePatchIdea } from '../../ideas.api'
import { EditIdeaDto, IdeaDto, IdeaStatus } from '../../ideas.dto'
import { useIdea } from '../useIdea'

interface OwnProps {
    idea: IdeaDto
}

export type IdeaEditProps = OwnProps

const IdeaEdit = ({ idea }: IdeaEditProps) => {
    const { t } = useTranslation()

    const [activate, setActivate] = useState(false)

    const history = useHistory()

    const { mutateAsync, isError } = usePatchIdea()

    const { canEditIdea } = useIdea(idea)

    const isDraft = useMemo(() => !idea.status || idea.status === IdeaStatus.Draft, [idea.status])

    const submit = async (formIdea: EditIdeaDto) => {
        const editedIdea = { id: idea.id, ...formIdea, status: activate ? IdeaStatus.Active : undefined }

        await mutateAsync(editedIdea, {
            onSuccess: () => {
                history.push(generatePath(ROUTE_IDEA, { ideaId: idea.id }))
            },
        })
    }

    const doActivate = () => setActivate(true)
    const dontActivate = () => setActivate(false)

    if (!canEditIdea) {
        return <Container error={t('idea.details.cannotEditIdea')} />
    }

    return (
        <Container title={t('idea.details.editTitle')}>
            <IdeaForm idea={idea} onSubmit={submit}>
                {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}
                <FormFooterButtonsContainer>
                    <FormFooterButton type={'submit'} variant={'contained'} onClick={doActivate}>
                        {isDraft ? t('idea.details.saveAndActivate') : t('idea.details.save')}
                    </FormFooterButton>
                    {isDraft ? (
                        <FormFooterButton type={'submit'} variant={'outlined'} onClick={dontActivate}>
                            {t('idea.details.saveDraft')}
                        </FormFooterButton>
                    ) : null}
                </FormFooterButtonsContainer>
            </IdeaForm>
        </Container>
    )
}
export default IdeaEdit
