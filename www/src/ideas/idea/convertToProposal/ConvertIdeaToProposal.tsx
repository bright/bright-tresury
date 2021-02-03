import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";
import {useHistory, useLocation} from "react-router-dom";
import {LeftButton, RightButton} from "../../../components/formContainer/FormButtons";
import FormContainer from "../../../components/formContainer/FormContainer";
import {ROUTE_PROPOSALS} from "../../../routes";
import IdeaForm from "../../form/IdeaForm";
import {getIdeaById, IdeaDto, IdeaStatus, updateIdea} from "../../ideas.api";
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
                setIdea(editedIdea)
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

    const goToProposals = () => {
        history.push(ROUTE_PROPOSALS)
    }

    // TODO protect this rout with auth
    const canConvertToProposal = useMemo(() => idea && (idea.status === IdeaStatus.Draft || idea.status === IdeaStatus.Active),
        [idea])

    return canConvertToProposal ? <FormContainer title={t('idea.convertToProposal.title')}>
            {idea &&
            <>
                <IdeaForm idea={idea} onSubmit={submit} extendedValidation={true} foldable={true}>
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
                    onSuccess={goToProposals}
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    idea={idea}/>
            </>
            }
        </FormContainer> :
        <FormContainer title={t('idea.convertToProposal.cannotConvertError')}/>
}

export default ConvertIdeaToProposal
