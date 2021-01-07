import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React from 'react';
import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {FieldArray, Formik} from "formik";
import * as Yup from 'yup'
import {breakpoints} from "../../theme/theme";
import {createIdea, IdeaDto} from "../ideas.api";
import {ROUTE_IDEAS} from "../../routes";
import {FormInput} from "../../components/input/FormInput";
import {FormSelect} from "../../components/select/FormSelect";
import {Button} from "../../components/button/Button";
import config from "../../config";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            marginTop: '2em'
        },
        inputField: {
            marginTop: '2em'
        },
        smallField: {
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
        fieldSelect: {
            backgroundColor: theme.palette.background.default,
            fontWeight: 500
        },
        submitButtons: {
            margin: '3em 0',
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                justifyContent: 'inherit',
                flexDirection: 'column-reverse'
            },
        },
        bottomButtons: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%'
            },
        },
        saveAsDraftButton: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                marginTop: '2em'
            },
        }
    }),
);

interface Props {
    idea: IdeaDto,
    setIdea?: (idea: IdeaDto) => void,
}

const IdeaForm: React.FC<Props> = ({idea, setIdea}) => {
    const classes = useStyles()
    const history = useHistory()
    const {t} = useTranslation()
    const isNew = (): boolean => idea.id === undefined

    const save = async (formIdea: IdeaDto) => {
        if (isNew()) {
            const editedIdea = {...idea, ...formIdea}
            await createIdea(editedIdea)
            history.push(ROUTE_IDEAS)
        }
    }

    const validationSchema = Yup.object({
        title: Yup.string().required(t('idea.details.form.emptyFieldError'))
    })

    return (
            <Formik
                initialValues={{
                    ...idea,
                    links: (idea.links && idea.links.length > 0) ? idea.links : ['']
                }}
                validationSchema={validationSchema}
                onSubmit={save}>
                {({
                      values,
                      handleSubmit
                  }) =>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <div className={classes.inputField}>
                            <FormInput
                                name="title"
                                placeholder={t('idea.details.title')}
                                label={t('idea.details.title')}/>
                        </div>
                        <div className={`${classes.inputField} ${classes.smallField}`}>
                            <FormInput
                                name="beneficiary"
                                placeholder={t('idea.details.beneficiary')}
                                label={t('idea.details.beneficiary')}
                            />
                        </div>
                        <div className={`${classes.inputField} ${classes.smallField}`}>
                            <FormSelect
                                className={classes.fieldSelect}
                                name="field"
                                label={t('idea.details.field')}
                                placeholder={t('idea.details.field')}
                                options={['Optimisation', 'Treasury', 'Transactions']}
                                value={values.field}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <FormInput
                                name="content"
                                multiline={true}
                                rows={8}
                                label={t('idea.details.content')}
                                placeholder={t('idea.details.content')}
                            />
                        </div>
                        {values.networks.map((network, index) => {
                                return (<div className={`${classes.inputField} ${classes.smallField}`} key={network.name}>
                                        <FormInput
                                            name={`networks[${index}].value`}
                                            type={`number`}
                                            label={t('idea.details.reward')}
                                            placeholder={t('idea.details.reward')}
                                            endAdornment={config.NETWORK_CURRENCY}
                                        />
                                    </div>
                                )
                            }
                        )}
                        <div className={classes.inputField}>
                            <FormInput
                                name="contact"
                                multiline={true}
                                rows={4}
                                label={t('idea.details.contact')}
                                placeholder={t('idea.details.contact')}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <FormInput
                                name="portfolio"
                                multiline={true}
                                rows={4}
                                label={t('idea.details.portfolio')}
                                placeholder={t('idea.details.portfolio')}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <FieldArray name={'links'} render={arrayHelpers => (
                                <div>
                                    {values.links ? values.links.map((link: string, index: number) =>
                                        <div className={classes.inputField} key={index}>
                                            <FormInput
                                                name={`links[${index}]`}
                                                label={index === 0 ? t('idea.details.links') : ''}
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
                                className={`${classes.bottomButtons} ${classes.saveAsDraftButton}`}
                                variant={"outlined"} color="primary" type="button">
                                {t('idea.details.saveDraft')}
                            </Button>
                            <Button
                                className={classes.bottomButtons}
                                variant={"contained"} color="primary" type="submit">
                                {t(isNew() ? 'idea.details.create' : 'idea.details.edit')}
                            </Button>
                        </div>
                    </form>
                }
            </Formik>
    );
}

export default IdeaForm
