import { Button, FilledInput, FormControl, InputAdornment, Modal, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ROUTE_IDEAS, ROUTE_NEW_IDEA } from '../routes';
import { createIdea, getIdeaById, Idea, IdeaNetwork } from './ideas.api';
import SubmitProposal from './SubmitProposal';

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            width: '100%',
            margin: 5
        },
    }),
);

interface Props {
    idea: Idea,
    setIdea: (idea: Idea) => void
}

const IdeaDetailsForm: React.FC<Props> = ({ idea, setIdea }) => {
    const classes = useStyles()

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIdea({ ...idea, title: event.target.value });
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIdea({ ...idea, content: event.target.value });
    }

    const handleChangeBeneficiary = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIdea({ ...idea, beneficiary: event.target.value });
    }

    const handleChangeNetwork = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        const { networks } = idea
        const id = networks.findIndex(n => n.name === event.target.id)
        if (id < 0) return

        const newNetwork = { ...(networks[id]) }
        newNetwork.value = value

        const newNetworks = [...networks.slice(0, id), newNetwork, ...networks.slice(id + 1, networks.length)]
        setIdea({ ...idea, networks: newNetworks });
    }

    return (
        <form className={classes.form} autoComplete="off">
            <div>
                <TextField
                    disabled={!!idea.id}
                    className={classes.form}
                    id="title"
                    label="Title"
                    value={idea.title}
                    onChange={handleChangeTitle}
                    required={true} />
            </div>
            <div>
                <TextField
                    disabled={!!idea.id}
                    className={classes.form}
                    id="decription"
                    label="Decription"
                    value={idea.content}
                    onChange={handleChangeDescription}
                    multiline={true}
                />
            </div>
            <div>
                <TextField
                    disabled={!!idea.id}
                    className={classes.form}
                    id="beneficiary"
                    label="Beneficiary"
                    value={idea.beneficiary}
                    onChange={handleChangeBeneficiary}
                    multiline={true}
                />
            </div>
            <div>
                {idea.networks.map((network) => {
                    return (
                        <FormControl>
                            <FilledInput
                                disabled={!!idea.id}
                                className={classes.form}
                                key={network.name}
                                id={network.name}
                                value={network.value}
                                onChange={handleChangeNetwork}
                                endAdornment={<InputAdornment position="end">LOC</InputAdornment>}
                                inputProps={{
                                    'aria-label': 'value',
                                }}
                            />
                        </FormControl>
                    )
                }
                )}
            </div>
        </form>
    );
}

export default IdeaDetailsForm