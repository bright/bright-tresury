import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {getIdeaById, IdeaDto, IdeaNetworkDto} from '../ideas.api';
import IdeaHeader from "./IdeaHeader";
import {IdeaContentType} from "./IdeaContentTypeTabs";
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import {ROUTE_IDEA} from "../../routes";
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
    const history = useHistory()

    let {ideaId} = useParams<{ ideaId: string }>()
    let {contentType} = useParams<{ contentType?: IdeaContentType }>()
    const setContentType = (contentType: IdeaContentType) => {
        const newPath = pathToRegexp.compile(ROUTE_IDEA)({
            ideaId,
            contentType,
        })
        history.replace(newPath)
    }
    const [idea, setIdea] = useState<IdeaDto>({
        title: '',
        beneficiary: '',
        field: '',
        content: '',
        networks: [{name: network, value: 0} as IdeaNetworkDto],
        contact: '',
        portfolio: '',
        links: [''],
    })

    useEffect(() => {
        if (ideaId !== undefined) {
            getIdeaById(ideaId).then((result) => {
                setIdea(result)
            }).catch()
        }
    }, [ideaId])

    let {path} = useRouteMatch();

    const currentContentType = contentType ? contentType : IdeaContentType.Info

    return (
        <div className={classes.root}>
            <IdeaHeader idea={idea} contentType={currentContentType} setContentType={setContentType}/>
            <div className={classes.content}>
                <Switch>
                    <Route exact={true} path={`${path}/${IdeaContentType.Info}`}>
                        <IdeaInfo idea={idea}/>
                    </Route>
                    <Route exact={true} path={`${path}/${IdeaContentType.Milestones}`}>
                        <IdeaMilestones/>
                    </Route>
                    <Route exact={true} path={`${path}/${IdeaContentType.Discussion}`}>
                        <IdeaDiscussion/>
                    </Route>
                    <Route exact={true} path={path}>
                        <IdeaInfo idea={idea}/>
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default Idea
