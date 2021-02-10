import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {LeftButton, RightButton} from "../../components/formContainer/FormButtons";
import FormContainer from "../../components/formContainer/FormContainer";
import config from "../../config";
import {ROUTE_IDEAS} from "../../routes";
import IdeaForm from "../form/IdeaForm";
import {createEmptyIdea, createIdea, IdeaDto, IdeaStatus} from "../ideas.api";

interface Props {
    network: string
}

const IdeaCreate: React.FC<Props> = ({network = config.NETWORK_NAME}) => {
    const {t} = useTranslation()
    const history = useHistory()
    const [idea] = useState(createEmptyIdea(network))
    const [activate, setActivate] = useState(false)

    const save = async (formIdea: IdeaDto) => {
        const editedIdea = {...idea, ...formIdea, status: activate ? IdeaStatus.Active : IdeaStatus.Draft}
        await createIdea(editedIdea)
        history.push(ROUTE_IDEAS)
    }

    const doActivate = () => setActivate(true)
    const dontActivate = () => setActivate(false)

    return <FormContainer title={t('idea.introduceTitle')}>
        <IdeaForm idea={idea} onSubmit={save}>
            <RightButton
                onClick={doActivate}>
                {t('idea.details.create')}
            </RightButton>
            <LeftButton
                onClick={dontActivate}>
                {t('idea.details.saveDraft')}
            </LeftButton>
        </IdeaForm>
    </FormContainer>
}

export default IdeaCreate
