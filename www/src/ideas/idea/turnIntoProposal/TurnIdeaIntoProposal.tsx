import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";
import {useHistory, useLocation} from "react-router-dom";
import {useAuth} from "../../../auth/AuthContext";
import Container from "../../../components/form/Container";
import IdeaForm from "../../form/IdeaForm";
import { getIdeaById, IdeaDto, IdeaStatus, turnIdeaIntoProposal, updateIdea } from '../../ideas.api'
import { ExtrinsicDetails, SubmitProposalModal } from '../../SubmitProposalModal'
import {RightButton, LeftButton} from "../../../components/form/buttons/Buttons";
import { useModal } from '../../../components/modal/useModal'

const TurnIdeaIntoProposal = () => {

    const { t } = useTranslation()

    const history = useHistory()

    const location = useLocation()

    const submitProposalModal = useModal()

    const [idea, setIdea] = useState<IdeaDto | undefined>()

    let { ideaId } = useParams<{ ideaId: string }>()

    const { isUserVerified, user } = useAuth()

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
                submitProposalModal.open()
            })
            .catch((error) => {
                console.log('error')
            })
    }

    const goBack = () => {
        history.goBack()
    }

    const canTurnIntoProposal = useMemo(() => idea
        && (idea.status === IdeaStatus.Draft || idea.status === IdeaStatus.Active)
        && (isUserVerified && user?.id === idea.ownerId),
        [idea, isUserVerified, user])

    const onTurn = useCallback((extrinsicDetails: ExtrinsicDetails) => {
        if (idea) {
            turnIdeaIntoProposal(extrinsicDetails, idea, idea.networks[0])
                .then((res) => console.log(res))
                .catch((err) => console.log(err))
        }
    }, [idea])

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
                    open={submitProposalModal.visible}
                    onClose={submitProposalModal.close}
                    onTurn={onTurn}
                    title={t('idea.details.submitProposalModal.title')}
                    value={idea.networks[0].value}
                    beneficiary={idea.beneficiary}
                />
            </>
            }
        </Container> :
<<<<<<< HEAD
        <Container title={t('idea.turnIntoProposal.cannotTurnError')} />
=======
        <Container title={t('idea.turnIntoProposal.cannotTurnError')}/>
>>>>>>> cbbad66... TREAS-8 Rename all frontend components with their content to use turnXIntoProposal instead of convertXToProposal
}

export default TurnIdeaIntoProposal
