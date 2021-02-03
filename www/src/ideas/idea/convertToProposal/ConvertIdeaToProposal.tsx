import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";
import {useHistory, useLocation} from "react-router-dom";
import {LeftButton, RightButton} from "../../../components/formContainer/FormButtons";
import FormContainer from "../../../components/formContainer/FormContainer";
import IdeaForm from "../../form/IdeaForm";
import {getIdeaById, IdeaDto, updateIdea} from "../../ideas.api";
import SubmitProposalModal from "../../SubmitProposalModal";

const ConvertIdeaToProposal: React.FC = () => {
    const {t} = useTranslation()
    const [modalOpen, setModalOpen] = useState(false)
    const [idea, setIdea] = useState<IdeaDto | undefined>()
    const location = useLocation()
    let {ideaId} = useParams<{ ideaId: string }>()

    useEffect(() => {
        const state = location.state as { idea?: IdeaDto }
        if (!state?.idea) {
            getIdeaById(ideaId)
                .then((result) => {
                    setIdea(result)
                })
                .catch((err) => {
                    setIdea(undefined)
                })
        } else {
            setIdea(state.idea)
        }
    }, [location, ideaId])

    const submit = async (formIdea: IdeaDto) => {
        const editedIdea = {...idea, ...formIdea}
        await updateIdea(editedIdea)
            .then(() => {
                setModalOpen(true)
            })
            .catch((error) => {
                console.log('error')
            })
    }

    const history = useHistory()

    const goBack = () => {
        history.goBack()
    }


    return <FormContainer title={t('idea.convertToProposal.title')}>
        {idea &&
        <>
            <IdeaForm idea={idea} onSubmit={submit}>
                <RightButton>
                    {t('idea.convertToProposal.submit')}
                </RightButton>
                <LeftButton
                    type={'button'}
                    onClick={goBack}>
                    {t('idea.convertToProposal.cancel')}
                </LeftButton>
            </IdeaForm>
            <SubmitProposalModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                idea={idea}/>
        </>
        }
    </FormContainer>
}

export default ConvertIdeaToProposal
