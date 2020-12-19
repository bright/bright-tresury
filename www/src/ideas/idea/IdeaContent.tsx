import React from "react";
import {IdeaDto} from "../ideas.api";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import IdeaDetails, {IdeaDetailsState} from "../details/IdeaDetails";

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
}

const IdeaContent: React.FC<Props> = ({idea}) => {
    const classes = useStyles()

    return <div className={classes.root}>
        <IdeaDetails idea={idea} setIdea={() => {}} state={IdeaDetailsState.STATIC}/>
    </div>
}

export default IdeaContent
