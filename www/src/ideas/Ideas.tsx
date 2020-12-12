import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {ROUTE_NEW_IDEA} from '../routes';
import {getIdeasByNetwork, Idea} from './ideas.api';
import {Button} from "../components/button/Button";
import {useTranslation} from "react-i18next";
import IdeaTile from "./IdeaTile";
import {breakpoints} from "../theme/theme";
import config from '../config';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tilesContainer: {
            padding: '26px 32px',
            display: 'inline-block',
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '26px 18px',
                marginLeft: '4em',
            },
        }
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
        <div>
            <Button variant="contained" color="primary" onClick={goToNewIdea}>
                {t('idea.introduce')}
            </Button>
            <div className={classes.tilesContainer}>
                <Grid container spacing={2}>
                    {status === 'loading' && <p>Loading</p>}
                    {status === 'error' && <p>Error</p>}
                    {status === 'resolved' && (
                        ideas.map((idea) => (
                            <Grid key={idea.id} item xs={12} md={6}>
                                <IdeaTile idea={idea}/>
                            </Grid>
                        ))
                    )}
                </Grid>
            </div>
        </div>
    );
}

export default Ideas
