import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";
import {useHistory, useLocation} from "react-router-dom";
import {useAuth} from "../../../auth/AuthContext";
import Container from "../../../components/form/Container";
import {ROUTE_PROPOSALS} from "../../../routes/routes";
import IdeaForm from "../../form/IdeaForm";
import {getIdeaById, IdeaDto, IdeaStatus, updateIdea} from "../../ideas.api";
import SubmitProposalModal from "../../SubmitProposalModal";
import {RightButton, LeftButton} from "../../../components/form/buttons/Buttons";

const TurnIdeaIntoProposal = () => {

    const {t} = useTranslation()
    const [modalOpen, setModalOpen] = useState(false)
    const [idea, setIdea] = useState<IdeaDto | undefined>()
    const location = useLocation()
    let {ideaId} = useParams<{ ideaId: string }>()
    const {isUserVerified, user} = useAuth()

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

    const canTurnIntoProposal = useMemo(() => idea
        && (idea.status === IdeaStatus.Draft || idea.status === IdeaStatus.Active)
        && (isUserVerified && user?.id === idea.ownerId),
        [idea, isUserVerified, user])

    return canTurnIntoProposal ? <Container title={t('idea.turnIntoProposal.title')}>
            {idea &&
            <>
                <IdeaForm idea={idea} onSubmit={submit} extendedValidation={true} foldable={true}>
                    <RightButton>
                        {t('idea.turnIntoProposal.submit')}
                    </RightButton>
                    <LeftButton
                        type={'button'}
                        onClick={goBack}>
                        {t('idea.turnIntoProposal.cancel')}
                    </LeftButton>
                </IdeaForm>
                <SubmitProposalModal
                    onSuccess={goToProposals}
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    idea={idea}/>
            </>
            }
        </Container> :
        <Container title={t('idea.turnIntoProposal.cannotConvertError')}/>
}

export default TurnIdeaIntoProposal
