import React from "react";
import IdeaForm from "../../form/IdeaForm";
import {IdeaDto} from "../../ideas.api";
import IdeaDetails from "../../details/IdeaDetails";

interface Props {
    idea: IdeaDto
}

const IdeaInfo: React.FC<Props> = ({idea}) => {
    /**
     * TODO:// check if [idea] belongs to the currently logged in user
     */
    const doesIdeaBelongToCurrentUser = () => true

    return <div>
        { doesIdeaBelongToCurrentUser() ? <IdeaForm idea={idea} /> : <IdeaDetails idea={idea}/>}
    </div>
}

export default IdeaInfo
