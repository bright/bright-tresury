import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useParams, useLocation} from 'react-router';
import {Button} from "../components/button/Button";
import {breakpoints} from "../theme/theme";
import IdeaDetailsForm from './IdeaDetailsForm';
import {getIdeaById, Idea, IdeaNetwork} from './ideas.api';
import SubmitProposalModal from "./SubmitProposalModal";
import IdeaFormHeader from "./details/form/IdeaFormHeader";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: '3em 5em 3em 3em',
            background: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '1em 1.5em 3em 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1em 1.5em 4em 1em',
            },
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'center'
        },
    }),
);

interface Props {
    network: string
    state: IdeaDetailsState
}

const IdeaDetails: React.FC<Props> = ({network, state}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    let {ideaId} = useParams<{ ideaId: string }>()

    const [idea, setIdea] = useState<Idea>({
        title: '',
        beneficiary: '',
        field: '',
        content: '',
        networks: [{name: network, value: 0} as IdeaNetwork],
        contact: '',
        portfolio: '',
        links: [],
    })
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (ideaId !== undefined) {
            getIdeaById(ideaId).then((result) => {
                setIdea(result)
            }).catch()
        }
    }, [ideaId])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const isNew = (): boolean => idea.id === undefined

    return (
        <div className={classes.root}>
            {state === IdeaDetailsState.EDITABLE ? <IdeaFormHeader isNewIdea={isNew()}/> :
                state === IdeaDetailsState.STATIC_DETAILS ? <div>
                Details
            </div> : null}
            <IdeaDetailsForm idea={idea} setIdea={setIdea}/>
            {!!idea.id && <>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    {t('idea.details.submitProposal')}
                </Button>
                <SubmitProposalModal
                    open={open}
                    onClose={handleClose}
                    idea={idea}/>
            </>}
        </div>
    );
}

export default IdeaDetails

export enum IdeaDetailsState {
    STATIC_DETAILS,
    EDITABLE
}
