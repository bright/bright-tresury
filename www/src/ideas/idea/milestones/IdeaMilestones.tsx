import React, {useEffect, useState} from "react";
import {getIdeaMilestones} from "./idea.milestones.api";
import {EmptyIdeaMilestonesArrayInfo} from "./components/IdeaEmptyMilestonesArrayInfo";
import {CreateIdeaMilestoneModal} from "./create/CreateIdeaMilestoneModal";
import {IdeaNetworkDto} from "../../ideas.api";
import {IdeaMilestonesList} from "./components/IdeaMilestonesList";
import {LoadingWrapper, useLoading} from "../../../components/loading/LoadingWrapper";
import {CreateIdeaMilestoneButton} from "./components/CreateIdeaMilestoneButton";
import {useTranslation} from "react-i18next";

interface Props {
    ideaId: string,
    canEdit: boolean
    networks: IdeaNetworkDto[]
}

export const IdeaMilestones = ({ ideaId, canEdit, networks }: Props) => {

    const { t } = useTranslation()

    const [isCreateIdeaMilestoneModalOpen, setIsCreateIdeaMilestoneModalOpen] = useState<boolean>(false)

    const { loadingState, response: ideaMilestones = [], call: fetchIdeaMilestones } = useLoading(getIdeaMilestones)

    useEffect(() => {
        fetchIdeaMilestones(ideaId)
    },[ideaId])

    const handleCreateIdeaMilestoneModalClose = (isIdeaMilestoneSuccessfullyCreated: boolean) => {
        setIsCreateIdeaMilestoneModalOpen(false)
        if (isIdeaMilestoneSuccessfullyCreated) {
            fetchIdeaMilestones(ideaId)
        }
    }

    return (
        <LoadingWrapper loadingState={loadingState}>
            <>
                { ideaMilestones.length === 0 && <EmptyIdeaMilestonesArrayInfo /> }
                { canEdit &&
                    <CreateIdeaMilestoneButton
                        text={t('idea.milestones.createMilestone')}
                        onClick={() => setIsCreateIdeaMilestoneModalOpen(true)}
                    />
                }
                <IdeaMilestonesList ideaId={ideaId} canEdit={canEdit} ideaMilestones={ideaMilestones} fetchIdeaMilestones={fetchIdeaMilestones} />
                {isCreateIdeaMilestoneModalOpen &&
                    <CreateIdeaMilestoneModal
                        ideaId={ideaId}
                        network={networks[0].name}
                        handleCloseModal={handleCreateIdeaMilestoneModalClose}
                    />
                }
            </>
        </LoadingWrapper>
    )
}
