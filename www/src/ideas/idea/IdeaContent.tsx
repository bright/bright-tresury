import React from "react";
import {IdeaDto} from "../ideas.api";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import IdeaDetails, {IdeaDetailsState} from "../details/IdeaDetails";
import {IdeaContentType} from "./IdeaContentTypeTabs";
import IdeaMilestones from "./milestones/IdeaMilestones";
import IdeaDiscussion from "./discussion/IdeaDiscussion";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '3em 5em 3em 3em',
            background: theme.palette.background.paper
        },
    }),
);


interface Props {
    idea: IdeaDto
    contentType: IdeaContentType
}

const IdeaContent: React.FC<Props> = ({idea, contentType}) => {
    const classes = useStyles()

    return <div className={classes.root}>
        {contentType === IdeaContentType.Info ?
            <IdeaDetails idea={idea} setIdea={() => {
            }} state={IdeaDetailsState.STATIC}/>
            : contentType === IdeaContentType.Milestones ? <IdeaMilestones/>
                : contentType === IdeaContentType.Discussion ? <IdeaDiscussion/> : null
        }
    </div>
}

export default IdeaContent
