import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { getIdeasByNetwork, IdeaResponse } from './ideas.api';

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
    const classes = useStyles();

    const [ideas, setIdeas] = useState<IdeaResponse[]>([])
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

    return (
        <>
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary">
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
        </>
    );
}

export default Ideas