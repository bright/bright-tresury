import {createStyles, makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useParams} from 'react-router';
import {Button} from "../components/button/Button";
import IdeaDetailsForm from './IdeaDetailsForm';
import {getIdeaById, Idea, IdeaNetwork} from './ideas.api';
import {Button} from "../components/button/Button";
import {useTranslation} from "react-i18next";
import {Header} from "../components/header/Header";
import {IconButton} from "../components/button/IconButton";
import CrossSvg from "../assets/cross.svg";
import {useHistory} from "react-router-dom";
import {breakpoints} from "../theme/theme";
import {ROUTE_IDEAS} from "../routes";
import SubmitProposalModal from "./SubmitProposalModal";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: '3em 5em 3em 3em',
            background: '#F5F5F5',
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
}

const IdeaDetails: React.FC<Props> = ({network = 'localhost'}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const history = useHistory()

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

    const navigateToList = () => {
        history.push(ROUTE_IDEAS)
    }

    return (
        <div className={classes.root}>
            <div className={classes.headerContainer}>
                <Header>
                    {t(isNew() ? 'idea.introduceTitle' : 'idea.editTitle')}
                </Header>
                <IconButton svg={CrossSvg} onClick={navigateToList}/>
            </div>
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
