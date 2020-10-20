import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTE_IDEAS } from '../routes';
import { createIdea, Idea, IdeaNetwork } from './ideas.api';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        form: {
            width: '100%',
            margin: 5
        },
    }),
);

interface Props {
    network: string
}

const NewIdea: React.FC<Props> = ({ network = 'kusama' }) => {
    const classes = useStyles();

    const history = useHistory()

    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [networks, setNetworks] = useState<IdeaNetwork[]>([{ name: network, value: 0 } as IdeaNetwork])

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const create = async () => {
        const idea: Idea = { title, content: description, networks }
        await createIdea(idea)
        history.push(ROUTE_IDEAS)
    }

    return (
        <form className={classes.form} noValidate autoComplete="off">
            <div>
                <TextField className={classes.form}
                    id="title"
                    label="Title"
                    value={title}
                    onChange={handleChangeTitle}
                    required={true} />
            </div>
            <div>
                <TextField className={classes.form}
                    id="decription"
                    label="Decription"
                    value={description}
                    onChange={handleChangeDescription}
                    multiline={true}
                />
            </div>
            <Button variant="contained" color="primary" onClick={create}>
                Create
            </Button>
        </form>
    );
}

export default NewIdea