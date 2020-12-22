import React from "react";
import {IdeaDto} from "../ideas.api";

interface Props {
    idea: IdeaDto
}

const IdeaDetails: React.FC<Props> = ({idea}) => {
    return <div>
        Idea Details
    </div>
    const validationSchema = Yup.object({
        title: Yup.string().required(t('idea.details.form.emptyFieldError'))
    })

    return (
            <Formik
                enableReinitialize={true}
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
                                placeholder={t('idea.details.form.title')}
                                label={t('idea.details.form.title')}/>
                        </div>
                        <div className={`${classes.inputField} ${classes.smallField}`}>
                            <FormInput
                                name="beneficiary"
                                placeholder={t('idea.details.form.beneficiary')}
                                label={t('idea.details.form.beneficiary')}
                            />
                        </div>
                        <div className={`${classes.inputField} ${classes.smallField}`}>
                            <FormSelect
                                className={classes.fieldSelect}
                                name="field"
                                label={t('idea.details.form.field')}
                                placeholder={t('idea.details.form.field')}
                                options={['Optimisation', 'Treasury', 'Transactions']}
                                value={values.field}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <FormInput
                                name="content"
                                multiline={true}
                                rows={8}
                                label={t('idea.details.form.content')}
                                placeholder={t('idea.details.form.content')}
                            />
                        </div>
                        {values.networks.map((network, index) => {
                                return (<div className={`${classes.inputField} ${classes.smallField}`} key={network.name}>
                                        <FormInput
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
                            <FormInput
                                name="contact"
                                multiline={true}
                                rows={4}
                                label={t('idea.details.form.contact')}
                                placeholder={t('idea.details.form.contact')}
                            />
                        </div>
                        <div className={classes.inputField}>
                            <FormInput
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
                                            <FormInput
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

export default IdeaDetails
