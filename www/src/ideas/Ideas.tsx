import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTE_NEW_IDEA } from '../routes';
import { getIdeasByNetwork, Idea } from './ideas.api';

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

const Ideas: React.FC<Props> = ({ network = 'kusama' }) => {
    const classes = useStyles()

    const history = useHistory()

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
                    + Introduce Idea
                    </Button>
            </Grid>
            <Grid container>
                {status === 'loading' && <p>Loading</p>}
                {status === 'error' && <p>Error</p>}
                {status === 'resolved' && (
                    ideas.map((idea) => (
                        <Grid key={idea.id} item xs={12} md={6}>
                            <Paper className={classes.paper} >
                                <p>{idea.title}</p>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
        </Grid>
    );
}

export default Ideas