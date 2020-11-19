import {Modal} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router';
import {Link} from 'react-router-dom';
import {ROUTE_IDEAS, ROUTE_NEW_IDEA} from '../routes';
import IdeaDetailsForm from './IdeaDetailsForm';
import {createIdea, getIdeaById, Idea, IdeaNetwork} from './ideas.api';
import SubmitProposal from './SubmitProposal';
import {Button} from "../components/button/Button";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);

interface Props {
    network: string
}

const IdeaDetails: React.FC<Props> = ({network = 'localhost'}) => {
    const classes = useStyles()
    const history = useHistory()

    let {ideaId} = useParams<{ ideaId: string }>()

    const [idea, setIdea] = useState<Idea>({
        title: '',
        content: '',
        networks: [{name: network, value: 0} as IdeaNetwork],
        beneficiary: ''
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

    const save = async () => {
        if (ideaId === undefined) {
            await createIdea(idea)
            history.push(ROUTE_IDEAS)
        }
    }

    return (
        <div className={classes.root}>
            <IdeaDetailsForm idea={idea} setIdea={setIdea}/>
            <Button variant="contained" color="primary" onClick={save}>
                Save
            </Button>
            {!!idea.id && <div>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Submit proposal
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
