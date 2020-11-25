import {createStyles, makeStyles} from '@material-ui/core/styles';
import React from 'react';
import {useHistory} from 'react-router-dom';
import {createIdea, Idea} from './ideas.api';
import {Input} from "../components/input/Input";
import {useTranslation} from "react-i18next";
import {Header} from "../components/header/Header";
import {FieldArray, Formik} from "formik";
import {Button} from "../components/button/Button";
import {Select} from "../components/select/Select";
import {ROUTE_IDEAS} from "../routes";

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            padding: '3em 5em 3em 3em',
            background: '#F5F5F5'
        },
        form: {
            marginTop: '2em'
        },
        inputField: {
            marginTop: '2em'
        },
        selectField: {
            marginTop: '2em',
            width: '50%',
        },
        rewardField: {
            marginTop: '2em',
            width: '50%'
        },
        submitButtons: {
            margin: '3em 0',
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
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
    const isNew = (): boolean => idea.id === undefined

    const save = async (formIdea: Idea) => {
        if (isNew()) {
            const editedIdea = {...idea, ...formIdea}
            await createIdea(editedIdea)
            history.push(ROUTE_IDEAS)
        }
    }

    return (
        <div className={classes.container}>
            <Header>
                {t(isNew() ? 'idea.introduceTitle' : 'idea.editTitle')}
            </Header>
            <Formik
                initialValues={{
                    ...idea,
                    links: (idea.links && idea.links.length > 0) ? idea.links : ['']
                }}
                onSubmit={save}>
                {({
                      values,
                      handleChange,
                      handleSubmit
                  }) =>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <div className={classes.inputField}>
                            <Input
                                name="title"
                                placeholder={t('idea.details.form.title')}
                                label={t('idea.details.form.title')}
                                required={true}/>
                        </div>
                        <div className={classes.selectField}>
                            <Input
                                name="beneficiary"
                                placeholder={t('idea.details.form.beneficiary')}
                                label={t('idea.details.form.beneficiary')}
                            />
                        </div>
                        <div className={classes.selectField}>
                            <Select
                                name="fieldOfIdea"
                                label={t('idea.details.form.fieldOfIdea')}
                                placeholder={t('idea.details.form.fieldOfIdea')}
                                options={['Optimisation', 'Treasury', 'Transactions']}
                                value={values.fieldOfIdea}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <Input
                                name="content"
                                multiline={true}
                                rows={8}
                                label={t('idea.details.form.content')}
                                placeholder={t('idea.details.form.content')}
                            />
                        </div>
                        {values.networks.map((network, index) => {
                                return (<div className={classes.rewardField} key={network.name}>
                                        <Input
                                            name={`networks[${index}].value`}
                                            type={`number`}
                                            label={t('idea.details.form.reward')}
                                            placeholder={t('idea.details.form.reward')}
                                            endAdornment={'LOC'}
                                        />
                                    </div>
                                )
                            }
                        )}
                        <div className={classes.inputField}>
                            <Input
                                name="contact"
                                multiline={true}
                                rows={4}
                                label={t('idea.details.form.contact')}
                                placeholder={t('idea.details.form.contact')}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <Input
                                name="portfolio"
                                multiline={true}
                                rows={4}
                                label={t('idea.details.form.portfolio')}
                                placeholder={t('idea.details.form.portfolio')}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <FieldArray name={'links'} render={arrayHelpers => (
                                <div>
                                    {values.links ? values.links.map((link: string, index: number) =>
                                        <div className={classes.inputField} key={index}>
                                            <Input
                                                name={`links[${index}]`}
                                                label={index === 0 ? t('idea.details.form.link') : ''}
                                                placeholder={t('idea.details.form.linkPlaceholder')}
                                            />
                                        </div>
                                    ) : null}
                                    <Button className={classes.inputField} variant={"text"} color="primary"
                                            type="button"
                                            onClick={() => arrayHelpers.push('')}>
                                        {t('idea.details.form.addLink')}
                                    </Button>
                                </div>
                            )}/>
                        </div>
                        <div className={classes.submitButtons}>
                            <Button
                                variant={"outlined"} color="primary" type="button">
                                {t('idea.details.saveDraft')}
                            </Button>
                            <Button
                                variant={"contained"} color="primary" type="submit">
                                {t(isNew() ? 'idea.details.create' : 'idea.details.edit')}
                            </Button>
                        </div>
                    </form>
                }
            </Formik>
        </div>
    );
}

export default IdeaDetailsForm
