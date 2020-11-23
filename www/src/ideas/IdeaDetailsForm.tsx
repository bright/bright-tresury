import {createStyles, makeStyles} from '@material-ui/core/styles';
import React from 'react';
import {Idea} from './ideas.api';
import {Input} from "../components/input/Input";
import {useTranslation} from "react-i18next";
import {Header} from "../components/header/Header";
import {FieldArray, Formik} from "formik";
import {Button, ButtonVariant} from "../components/button/Button";
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
        submitButton: {
            margin: '3em 0',
            float: 'right'
        },
        saveDraftButton: {
            margin: '3em 0',
            float: 'left'
        }
    }),
);

interface Props {
    idea: Idea,
    setIdea: (idea: Idea) => void
}

const IdeaDetailsForm: React.FC<Props> = ({idea, setIdea}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const save = async (formIdea: Idea) => {
        const editedIdea = {...idea, ...formIdea}
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
                                id="title"
                                name="title"
                                placeholder={t('idea.details.form.title')}
                                label={t('idea.details.form.title')}
                                value={values.title}
                                onChange={handleChange}
                                required={true}/>
                        </div>
                        <div className={classes.selectField}>
                            <Input
                                id="beneficiary"
                                name="beneficiary"
                                placeholder={t('idea.details.form.beneficiary')}
                                label={t('idea.details.form.beneficiary')}
                                value={values.beneficiary}
                                onChange={handleChange}/>
                        </div>
                        <div className={classes.selectField}>
                            <Select
                                id="fieldOfIdea"
                                name="fieldOfIdea"
                                renderValue={(value: string) => value}
                                label={t('idea.details.form.fieldOfIdea')}
                                placeholder={t('idea.details.form.fieldOfIdea')}
                                values={['Optimisation', 'Treasury', 'Transactions']}
                                value={values.fieldOfIdea}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <Input
                                id="content"
                                name="content"
                                multiline={true}
                                rows={8}
                                label={t('idea.details.form.content')}
                                placeholder={t('idea.details.form.content')}
                                value={values.content}
                                onChange={handleChange}
                            />
                        </div>
                        {values.networks.map((network, index) => {
                                return (<div className={classes.rewardField} key={network.name}>
                                        <Input
                                            id={`networks${index}`}
                                            name={`networks[${index}].value`}
                                            type={`number`}
                                            label={t('idea.details.form.reward')}
                                            placeholder={t('idea.details.form.reward')}
                                            value={network.value}
                                            onChange={handleChange}
                                            endAdornment={'LOC'}
                                        />
                                    </div>
                                )
                            }
                        )}
                        <div className={classes.inputField}>
                            <Input
                                id="contact"
                                name="contact"
                                multiline={true}
                                rows={4}
                                label={t('idea.details.form.contact')}
                                placeholder={t('idea.details.form.contact')}
                                value={values.contact}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <Input
                                id="portfolio"
                                name="portfolio"
                                multiline={true}
                                rows={4}
                                label={t('idea.details.form.portfolio')}
                                placeholder={t('idea.details.form.portfolio')}
                                value={values.portfolio}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <FieldArray name={'links'} render={arrayHelpers => (
                                <div>
                                    {values.links ? values.links.map((link: string, index: number) =>
                                        <div className={classes.inputField} key={index}>
                                            <Input
                                                id={`links${index}`}
                                                name={`links[${index}]`}
                                                value={link}
                                                label={index === 0 ? t('idea.details.form.link') : null}
                                                placeholder={t('idea.details.form.linkPlaceholder')}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    ) : null}
                                    <Button className={classes.inputField} variant={ButtonVariant.Text} color="primary"
                                            type="button"
                                            onClick={() => arrayHelpers.push('')}>
                                        {t('idea.details.form.addLink')}
                                    </Button>
                                </div>
                            )}/>
                        </div>
                        <div className={classes.inputField}>
                            <div className={classes.saveDraftButton}>
                                <Button
                                    variant={ButtonVariant.Outlined} color="primary" type="button">
                                    {t('idea.details.saveDraft')}
                                </Button>
                            </div>
                            <div className={classes.submitButton}>
                                <Button
                                    variant={ButtonVariant.Contained} color="primary" type="submit">
                                    {t(idea.id === undefined ? 'idea.details.create' : 'idea.details.edit')}
                                </Button>
                            </div>
                        </div>
                    </form>
                }
            </Formik>
        </div>
    );
}

export default IdeaDetailsForm
