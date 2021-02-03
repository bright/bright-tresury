import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {FieldArray} from "formik";
import React from 'react';
import {useTranslation} from "react-i18next";
import {Button} from "../../components/button/Button";
import {FormInput} from "../../components/input/FormInput";
import {FormSelect} from "../../components/select/FormSelect";
import config from "../../config";
import {breakpoints} from "../../theme/theme";
import {IdeaDto, IdeaNetworkDto} from "../ideas.api";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    values: IdeaDto
}

const IdeaFormFields: React.FC<Props> = ({values}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    return (
        <>
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
        </>
    );
}

export default IdeaFormFields
