import React from "react";
import IdeaForm from "../../form/IdeaForm";
import {IdeaDto} from "../../ideas.api";
import IdeaDetails from "../../details/IdeaDetails";

interface Props {
    idea: IdeaDto
    canEdit: boolean
}

const IdeaInfo: React.FC<Props> = ({idea, canEdit}) => {
    return <>
        {canEdit ? <IdeaForm idea={idea}/> : <IdeaDetails idea={idea}/>}
    </>
}

export default IdeaInfo
