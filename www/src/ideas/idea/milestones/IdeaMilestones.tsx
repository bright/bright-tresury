import React, {useEffect, useState} from "react";
import {getIdeaMilestones} from "./idea.milestones.api";
import {EmptyIdeaMilestonesArrayInfo} from "./components/IdeaEmptyMilestonesArrayInfo";
import {CreateIdeaMilestoneModal} from "./create/CreateIdeaMilestoneModal";
import {IdeaDto} from "../../ideas.api";
import {IdeaMilestonesList} from "./list/IdeaMilestonesList";
import {LoadingWrapper, useLoading} from "../../../components/loading/LoadingWrapper";
import {CreateIdeaMilestoneButton} from "./components/CreateIdeaMilestoneButton";
import {useTranslation} from "react-i18next";

interface Props {
    idea: IdeaDto,
    canEdit: boolean
}

export const IdeaMilestones = ({ idea, canEdit }: Props) => {

    const { t } = useTranslation()

    const [isCreateIdeaMilestoneModalOpen, setIsCreateIdeaMilestoneModalOpen] = useState<boolean>(false)

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
                    ? <CreateIdeaMilestoneButton
                        text={t('idea.milestones.createMilestone')}
                        onClick={() => setIsCreateIdeaMilestoneModalOpen(true)}
                      />
                    : null
                }
                <IdeaMilestonesList
                    idea={idea}
                    ideaMilestones={ideaMilestones}
                    canEdit={canEdit}
                    fetchIdeaMilestones={fetchIdeaMilestones}
                />
                <CreateIdeaMilestoneModal
                    open={isCreateIdeaMilestoneModalOpen}
                    idea={idea}
                    handleCloseModal={() => setIsCreateIdeaMilestoneModalOpen(false)}
                    fetchIdeaMilestones={fetchIdeaMilestones}
                />
            </>
        </LoadingWrapper>
    )
}
