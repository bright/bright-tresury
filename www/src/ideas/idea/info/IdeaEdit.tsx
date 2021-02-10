import React, {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {LeftButton, RightButton} from "../../../components/formContainer/FormButtons";
import {ROUTE_IDEAS} from "../../../routes";
import IdeaForm from "../../form/IdeaForm";
import {IdeaDto, IdeaStatus, updateIdea} from "../../ideas.api";

interface Props {
    idea: IdeaDto
}

const IdeaEdit: React.FC<Props> = ({idea}) => {
    const {t} = useTranslation()
    const history = useHistory()
    const [activate, setActivate] = useState(false)

    const isDraft = useMemo(() =>
        !idea.status || idea.status === IdeaStatus.Draft,
        [idea.status]
    )

    const save = async (formIdea: IdeaDto) => {
        const editedIdea = {...idea, ...formIdea, status: activate ? IdeaStatus.Active : idea.status}
        await updateIdea(editedIdea)
        history.push(ROUTE_IDEAS)
    }

    const doActivate = () => setActivate(true)
    const dontActivate = () => setActivate(false)

    return <IdeaForm idea={idea} onSubmit={save}>
        <RightButton
            onClick={doActivate}>
            {isDraft ? t('idea.details.editAndActivate') : t('idea.details.edit')}
        </RightButton>
        {isDraft && <LeftButton onClick={dontActivate}>
            {t('idea.details.saveDraft')}
        </LeftButton>}
    </IdeaForm>
}

export default IdeaEdit
