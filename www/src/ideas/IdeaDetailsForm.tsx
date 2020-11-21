import {FilledInput, FormControl, InputAdornment, InputLabel} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router';
import {Link} from 'react-router-dom';
import {ROUTE_IDEAS, ROUTE_NEW_IDEA} from '../routes';
import {createIdea, getIdeaById, Idea, IdeaNetwork} from './ideas.api';
import SubmitProposal from './SubmitProposal';
import {Input} from "../components/input/Input";
import {useTranslation} from "react-i18next";
import {Header} from "../components/header/Header";
import {Formik} from "formik";
import {Button} from "../components/button/Button";
import {Select} from "../components/select/Select";

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            position: 'absolute',
            width: '100%',
            padding: 36,
            background: '#F5F5F5'
        },
        form: {
            margin: 5
        },
    }),
);

interface Props {
    idea: Idea,
    setIdea: (idea: Idea) => void
}

const IdeaDetailsForm: React.FC<Props> = ({idea, setIdea}) => {
    const classes = useStyles()
    const history = useHistory()
    const {t} = useTranslation()

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIdea({...idea, title: event.target.value});
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIdea({...idea, content: event.target.value});
    }

    const handleChangeBeneficiary = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIdea({...idea, beneficiary: event.target.value});
    }

    const handleChangeNetwork = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        const {networks} = idea
        const id = networks.findIndex(n => n.name === event.target.id)
        if (id < 0) return

        const newNetwork = {...(networks[id])}
        newNetwork.value = value

        const newNetworks = [...networks.slice(0, id), newNetwork, ...networks.slice(id + 1, networks.length)]
        setIdea({...idea, networks: newNetworks});
    }

    const save = async (formIdea: Idea) => {
        if (idea.id === undefined) {
            await createIdea({...idea, ...formIdea})
            history.push(ROUTE_IDEAS)
        } else {

        }
    }

    return (
        <div className={classes.container}>
            <Header>
                {t(idea.id === undefined ? 'idea.introduceTitle' : 'idea.editTitle')}
            </Header>
            <Formik
                initialValues={idea}
                onSubmit={save}>
                {({
                     values,
                     handleChange,
                     handleSubmit
                 }) =>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <div>
                            <Input
                                className={classes.form}
                                id="title"
                                type="title"
                                name="title"
                                label={t('idea.details.form.title')}
                                value={values.title}
                                onChange={handleChange}
                                required={true}/>
                        </div>
                        <div>
                            <Input
                                id="description"
                                type="description"
                                name="description"
                                label={t('idea.details.form.description')}
                                value={values.content}
                                onChange={handleChange}
                                multiline={true}
                            />
                        </div>
                        <div>
                            <InputLabel shrink={true}>{t('idea.details.form.beneficiary')}</InputLabel>
                            <FilledInput
                                id="beneficiary"
                                value={values.beneficiary}
                                onChange={handleChange}
                                multiline={true}
                            />
                            <Select
                                value
                            />
                        </div>
                        <div>
                            {idea.networks.map((network) => {
                                    return (
                                        <FormControl>
                                            <InputLabel shrink={true}>{t('idea.details.form.reward')}</InputLabel>
                                            <FilledInput
                                                key={network.name}
                                                id={network.name}
                                                value={network.value}
                                                onChange={handleChange}
                                                endAdornment={<InputAdornment position="end">LOC</InputAdornment>}
                                            />
                                        </FormControl>
                                    )
                                }
                            )}
                        </div>
                        <Button variant="contained" color="primary" type="submit">
                            {t('idea.details.save')}
                        </Button>
                    </form>
            }
            </Formik>
        </div>
    );
}

export default IdeaDetailsForm
