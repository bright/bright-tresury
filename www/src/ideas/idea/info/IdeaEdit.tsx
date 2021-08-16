import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import IdeaForm from '../../form/IdeaForm'
import { usePatchIdea } from '../../ideas.api'
import { useHistory } from 'react-router'
import { ROUTE_IDEAS } from '../../../routes/routes'
import { EditIdeaDto, IdeaDto, IdeaStatus } from '../../ideas.dto'
import FormFooterErrorBox from '../../../components/form/footer/FormFooterErrorBox'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'

interface OwnProps {
    idea: IdeaDto
}

export type IdeaEditProps = OwnProps

const IdeaEdit = ({ idea }: IdeaEditProps) => {
    const { t } = useTranslation()

    const [activate, setActivate] = useState(false)

    const history = useHistory()

    const { mutateAsync, isError } = usePatchIdea()

    const isDraft = useMemo(() => !idea.status || idea.status === IdeaStatus.Draft, [idea.status])

    const submit = async (formIdea: EditIdeaDto) => {
        const editedIdea = { id: idea.id, ...formIdea, status: activate ? IdeaStatus.Active : undefined }

        await mutateAsync(editedIdea, {
            onSuccess: () => {
                history.push(ROUTE_IDEAS)
            },
        })
    }

    const doActivate = () => setActivate(true)
    const dontActivate = () => setActivate(false)

    return (
        <IdeaForm idea={idea} onSubmit={submit}>
            {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}

            <FormFooterButtonsContainer>
                <FormFooterButton type={'submit'} variant={'contained'} onClick={doActivate}>
                    {isDraft ? t('idea.details.editAndActivate') : t('idea.details.edit')}
                </FormFooterButton>

                {isDraft ? (
                    <FormFooterButton type={'submit'} variant={'outlined'} onClick={dontActivate}>
                        {t('idea.details.saveDraft')}
                    </FormFooterButton>
                ) : null}
            </FormFooterButtonsContainer>
        </IdeaForm>
    )
}
export default IdeaEdit
