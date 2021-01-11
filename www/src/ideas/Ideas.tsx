import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {generatePath, Link, useHistory} from 'react-router-dom';
import {ROUTE_IDEA, ROUTE_NEW_IDEA} from '../routes';
import {getIdeasByNetwork, Idea} from './ideas.api';
import {Button} from "../components/button/Button";
import {useTranslation} from "react-i18next";
import config from '../config';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            height: 140,
        },
    }),
);

interface Props {
    network: string
}

const Ideas: React.FC<Props> = ({network = config.NETWORK_NAME}) => {
    const classes = useStyles()

    const history = useHistory()
    const {t} = useTranslation()

    const [ideas, setIdeas] = useState<Idea[]>([])
    const [status, setStatus] = useState<string>('')

    useEffect(() => {
        setStatus('loading')
        getIdeasByNetwork(network)
            .then((reponse) => {
                setIdeas(reponse)
                setStatus('resolved')
            })
            .catch(() => {
                setStatus('error')
            })
    }, [network])

    const goToNewIdea = () => {
        history.push(ROUTE_NEW_IDEA)
    }

    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={goToNewIdea}>
                    {t('idea.introduce')}
                </Button>
            </Grid>
            <Grid container>
                {status === 'loading' && <p>Loading</p>}
                {status === 'error' && <p>Error</p>}
                {status === 'resolved' && (
                    ideas.map((idea) => (
                        <Grid key={idea.id} item xs={12} md={6}>
                            <Paper className={classes.paper}>
                                <Link to={generatePath(ROUTE_IDEA, {ideaId: idea.id})}>
                                    <p>{idea.title}</p>
                                </Link>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
        </Grid>
    );
}

export default Ideas
