import React from "react";
import {IdeaDto} from "../../ideas.api";
import IdeaDetails from "./IdeaDetails";
import IdeaEdit from "./IdeaEdit";

interface Props {
    idea: IdeaDto
    canEdit: boolean
}

const IdeaInfo: React.FC<Props> = ({idea, canEdit}) => {
    return <>
        {canEdit ? <IdeaEdit idea={idea}/> : <IdeaDetails idea={idea}/>}
    </>
}

export default IdeaInfo
