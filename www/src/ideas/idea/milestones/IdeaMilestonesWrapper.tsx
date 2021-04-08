import React from "react";
import {IdeaDto} from "../../ideas.api";
import {IdeaMilestones} from "./IdeaMilestones";

interface Props {
    idea: IdeaDto
    canEdit: boolean
}

export const IdeaMilestonesWrapper = ({ idea: { id, networks }, canEdit }: Props) => {
    if (id) {
        return <IdeaMilestones ideaId={id} canEdit={canEdit} networks={networks} />
    }
    return null
}