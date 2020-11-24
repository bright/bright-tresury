import {Modal} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import IdeaDetailsForm from './IdeaDetailsForm';
import {getIdeaById, Idea, IdeaNetwork} from './ideas.api';
import SubmitProposal from './SubmitProposal';
import {Button} from "../components/button/Button";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
        }
    }),
);

interface Props {
    network: string
}

const IdeaDetails: React.FC<Props> = ({network = 'localhost'}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    let {ideaId} = useParams<{ ideaId: string }>()

    const [idea, setIdea] = useState<Idea>({
        title: '',
        beneficiary: '',
        fieldOfIdea: '',
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

    return (
        <div className={classes.root}>
            <IdeaDetailsForm idea={idea} setIdea={setIdea}/>
            {!!idea.id && <div>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    {t('idea.details.submitProposal')}
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description">
                    <SubmitProposal value={idea.networks[0].value} beneficiary={idea.beneficiary} network={network}/>
                </Modal>
            </div>}
        </div>
    );
}

export default IdeaDetails
