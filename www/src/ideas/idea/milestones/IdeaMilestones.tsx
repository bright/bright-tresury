import React, {useEffect} from "react";
import {getIdeaMilestones} from "./idea.milestones.api";
import {EmptyIdeaMilestonesArrayInfo} from "./components/IdeaEmptyMilestonesArrayInfo";
import {IdeaMilestoneCreateModal} from "./create/IdeaMilestoneCreateModal";
import {IdeaDto} from "../../ideas.api";
import {IdeaMilestonesList} from "./list/IdeaMilestonesList";
import {LoadingWrapper, useLoading} from "../../../components/loading/LoadingWrapper";
import {CreateIdeaMilestoneButton} from "./components/CreateIdeaMilestoneButton";
import {useTranslation} from "react-i18next";
import { useModal } from '../../../components/modal/useModal'

interface Props {
    idea: IdeaDto,
    canEdit: boolean
}

export const IdeaMilestones = ({ idea, canEdit }: Props) => {

    const { t } = useTranslation()

    const createModal = useModal()

    const { loadingState, response: ideaMilestones = [], call } = useLoading(getIdeaMilestones)

    useEffect(() => {
        fetchIdeaMilestones()
    },[idea.id])

    const fetchIdeaMilestones = () => call(idea.id)

    return (
        <LoadingWrapper loadingState={loadingState}>
            <>
                { ideaMilestones.length === 0
                    ? <EmptyIdeaMilestonesArrayInfo />
                    : null
                }
                { canEdit
                    ? (
                        <CreateIdeaMilestoneButton
                            text={ t('idea.milestones.createMilestone') }
                            onClick={createModal.open}
                        />
                    )
                    : null
                }
                <IdeaMilestonesList
                    idea={idea}
                    ideaMilestones={ideaMilestones}
                    canEdit={canEdit}
                    fetchIdeaMilestones={fetchIdeaMilestones}
                />
                <IdeaMilestoneCreateModal
                    open={createModal.visible}
                    idea={idea}
                    onClose={createModal.close}
                    fetchIdeaMilestones={fetchIdeaMilestones}
                />
            </>
        </LoadingWrapper>
    )
}
