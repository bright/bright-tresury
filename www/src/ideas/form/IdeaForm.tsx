import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {FieldArray, Formik} from "formik";
import React from 'react';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup'
import {Button} from "../../components/button/Button";
import {FormButtonsContainer} from "../../components/formContainer/FormButtons";
import {FormInput} from "../../components/input/FormInput";
import {FormSelect} from "../../components/select/FormSelect";
import config from "../../config";
import {isValidAddressOrEmpty} from "../../util/addressValidator";
import {breakpoints} from "../../theme/theme";
import {IdeaDto, IdeaNetworkDto} from "../ideas.api";

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
    }),
);

interface Props {
    idea: IdeaDto,
    onSubmit: (idea: IdeaDto) => void
}

const IdeaForm: React.FC<Props> = ({idea, onSubmit, children}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('idea.details.form.emptyFieldError')),
        beneficiary: Yup.string().test('validate-address', t('idea.details.form.wrongBeneficiaryError'), (address) => {
            return isValidAddressOrEmpty(address)
        })
    })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                ...idea,
                links: (idea.links && idea.links.length > 0) ? idea.links : ['']
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({
                  values,
                  handleSubmit,
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
                    {values.networks.map((network: IdeaNetworkDto, index: number) => {
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
                    <FormButtonsContainer>
                        {children}
                    </FormButtonsContainer>
                </form>
            }
        </Formik>
    );
}

export default IdeaForm
