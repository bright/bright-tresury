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
            padding: '3em 5em 3em 3em',
            background: '#F5F5F5'
        },
        form: {
            marginTop: '2em'
        },
        formField: {
            marginTop: '2em !important'
        }
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
            // await createIdea({...idea, ...formIdea})
            // history.push(ROUTE_IDEAS)
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
                        <Input
                            className={classes.formField}
                            id="title"
                            type="title"
                            name="title"
                            placeholder={t('idea.details.form.title')}
                            label={t('idea.details.form.title')}
                            value={values.title}
                            onChange={handleChange}
                            required={true}/>
                        <Select
                            className={classes.formField}
                            id="beneficiary"
                            value={values.beneficiary}
                            onChange={handleChange}
                            multiline={true}
                        />
                        <Select
                            className={classes.formField}
                            id="fieldOfIdea"
                            value={values.fieldOfIdea}
                            onChange={handleChange}
                            multiline={true}
                        />
                        <Input
                            className={classes.formField}
                            id="content"
                            type="content"
                            name="content"
                            multiline={true}
                            rows={8}
                            label={t('idea.details.form.content')}
                            value={values.content}
                            onChange={handleChange}
                        />
                        {idea.networks.map((network) => {
                                return (
                                    <Input
                                        className={classes.formField}
                                        id={network.name}
                                        key={network.name}
                                        label={t('idea.details.form.reward')}
                                        value={network.value}
                                        onChange={handleChange}
                                        endAdornment={'LOC'}
                                    />
                                )
                            }
                        )}
                        <Input
                            className={classes.formField}
                            id="contact"
                            type="contact"
                            name="contact"
                            multiline={true}
                            rows={4}
                            label={t('idea.details.form.contact')}
                            value={values.contact}
                            onChange={handleChange}
                        />
                        <Input
                            className={classes.formField}
                            id="portfolio"
                            type="portfolio"
                            name="portfolio"
                            multiline={true}
                            rows={4}
                            label={t('idea.details.form.portfolio')}
                            value={values.portfolio}
                            onChange={handleChange}
                        />
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
