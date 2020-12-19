import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useParams} from 'react-router';
import {Button} from "../../components/button/Button";
import {breakpoints} from "../../theme/theme";
import {getIdeaById, IdeaDto, IdeaNetworkDto} from '../ideas.api';
import IdeaHeader from "./IdeaHeader";
import IdeaContent from "./IdeaContent";
import SubmitProposalModal from "../SubmitProposalModal";
import {IdeaContentType} from "./IdeaContentTypeTabs";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '1em 1.5em 3em 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1em 1.5em 4em 1em',
            },
        },
    }),
);

interface Props {
    network: string
}

const Idea: React.FC<Props> = ({network}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    let {ideaId} = useParams<{ ideaId: string }>()

    const [contentType, setContentType] = useState<IdeaContentType>(IdeaContentType.Info);
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

    return (
        <div className={classes.root}>
            <IdeaHeader idea={idea} setContentType={setContentType}/>
            <IdeaContent idea={idea} contentType={contentType}/>
        </div>
    );
}

export default Idea
