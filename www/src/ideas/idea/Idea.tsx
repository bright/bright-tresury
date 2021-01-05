import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {getIdeaById, IdeaDto, IdeaNetworkDto} from '../ideas.api';
import IdeaHeader from "./IdeaHeader";
import IdeaContent from "./IdeaContent";
import {IdeaContentType} from "./IdeaContentTypeTabs";
import {useHistory} from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import {ROUTE_IDEA} from "../../routes";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100vh',
            width: '100%',
            backgroundColor: theme.palette.background.paper
        },
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

    const currentContentType = contentType ? contentType : IdeaContentType.Info

    return (
        <div className={classes.root}>
            <IdeaHeader idea={idea} contentType={currentContentType} setContentType={setContentType}/>
            <IdeaContent idea={idea} contentType={currentContentType}/>
        </div>
    );
}

export default Idea
