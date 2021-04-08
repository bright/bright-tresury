import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState, useMemo} from 'react';
import {useParams} from 'react-router';
import {useAuth} from "../../auth/AuthContext";
import {createEmptyIdea, getIdeaById, IdeaDto} from '../ideas.api';
import IdeaHeader from "./IdeaHeader";
import {IdeaContentType} from "./IdeaContentTypeTabs";
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import IdeaInfo from "./info/IdeaInfo";
import IdeaDiscussion from "./discussion/IdeaDiscussion";
import {breakpoints} from "../../theme/theme";
import {IdeaMilestonesWrapper} from "./milestones/IdeaMilestonesWrapper";

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

const Idea = ({ network }: Props) => {
    const classes = useStyles()

    let {ideaId} = useParams<{ ideaId: string }>()

    let {path} = useRouteMatch();

    const [idea, setIdea] = useState<IdeaDto>(createEmptyIdea(network))

    /**
     * TODO:// check if [idea] belongs to the currently logged in user
     */
    const {isUserSignedIn} = useAuth()

    const canEdit = useMemo(() => {
        return isUserSignedIn
    }, [idea, isUserSignedIn])

    useEffect(() => {
        if (ideaId !== undefined) {
            getIdeaById(ideaId).then((result) => {
                setIdea(result)
            }).catch()
        }
    }, [ideaId])

    return (
        <div className={classes.root}>
            <IdeaHeader idea={idea} canEdit={canEdit} />
            <div className={classes.content}>
                <Switch>
                    <Route exact={true} path={path}>
                        <IdeaInfo idea={idea} canEdit={canEdit} />
                    </Route>
                    <Route exact={true} path={`${path}/${IdeaContentType.Info}`}>
                        <IdeaInfo idea={idea} canEdit={canEdit} />
                    </Route>
                    <Route exact={true} path={`${path}/${IdeaContentType.Milestones}`}>
                        <IdeaMilestonesWrapper idea={idea} canEdit={canEdit} />
                    </Route>
                    <Route exact={true} path={`${path}/${IdeaContentType.Discussion}`}>
                        <IdeaDiscussion />
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default Idea
