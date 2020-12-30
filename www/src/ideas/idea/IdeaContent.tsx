import React from "react";
import {IdeaDto} from "../ideas.api";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {IdeaContentType} from "./IdeaContentTypeTabs";
import IdeaMilestones from "./milestones/IdeaMilestones";
import IdeaDiscussion from "./discussion/IdeaDiscussion";
import IdeaInfo from "./info/IdeaInfo";
import {breakpoints} from "../../theme/theme";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2.5em 5em 3em 3em',
            background: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '2em 1.5em 3em 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1em 1.5em 4em 1em',
            },
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
            <IdeaInfo idea={idea}/>
            : contentType === IdeaContentType.Milestones ? <IdeaMilestones/>
                : contentType === IdeaContentType.Discussion ? <IdeaDiscussion/> : null
        }
    </div>
}

export default IdeaContent
