import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {createEmptyIdea, getIdeaById, IdeaDto} from '../ideas.api';
import IdeaHeader from "./IdeaHeader";
import {IdeaContentType} from "./IdeaContentTypeTabs";
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import IdeaInfo from "./info/IdeaInfo";
import IdeaMilestones from "./milestones/IdeaMilestones";
import IdeaDiscussion from "./discussion/IdeaDiscussion";
import {breakpoints} from "../../theme/theme";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100vh',
            width: '100%',
            backgroundColor: theme.palette.background.paper
        },
        content: {
            padding: '2.5em 5em 3em 3em',
            background: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '2em 1.5em 3em 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1em 1.5em 4em 1em',
            },
        }
    }),
);

interface Props {
    network: string
}

const Idea: React.FC<Props> = ({network}) => {
    const classes = useStyles()

    let {ideaId} = useParams<{ ideaId: string }>()

    const [idea, setIdea] = useState<IdeaDto>(createEmptyIdea(network))

    useEffect(() => {
        if (ideaId !== undefined) {
            getIdeaById(ideaId).then((result) => {
                setIdea(result)
            }).catch()
        }
    }, [ideaId])

    let {path} = useRouteMatch();

    return (
        <div className={classes.root}>
            <IdeaHeader idea={idea}/>
            <div className={classes.content}>
                <Switch>
                    <Route exact={true} path={path}>
                        <IdeaInfo idea={idea}/>
                    </Route>
                    <Route exact={true} path={`${path}/${IdeaContentType.Info}`}>
                        <IdeaInfo idea={idea}/>
                    </Route>
                    <Route exact={true} path={`${path}/${IdeaContentType.Milestones}`}>
                        <IdeaMilestones/>
                    </Route>
                    <Route exact={true} path={`${path}/${IdeaContentType.Discussion}`}>
                        <IdeaDiscussion/>
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default Idea
